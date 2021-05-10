import requests
import re
from bs4 import BeautifulSoup
import sys
import json
import warnings

warnings.filterwarnings('ignore')

class DevNull:
    def write(self, msg):
        pass

sys.stderr = DevNull()

# TODO: mirar el tema de las tildes
def scraping(provincia, municipio):
    URL = 'https://www.supermercados-en-espana.com'
    # print(URL)

    searchProvincias(URL, provincia, municipio)

def searchProvincias(URL, provincia, municipio):
    # provincia = input("Introduce el nombre de la provincia (con minúsculas y tilde): ")
    resultadoProvincia=False
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser', from_encoding="utf-8")
    # print("Encoding method :",soup.original_encoding)

    #ajusto el parametro de provicincia de la bbdd para cuadrar con la web
    provincia = provincia.lower()
    provincia = re.sub('provincia de ','',provincia)
    if provincia =="a coruña":
        provincia="la coruña"
    elif provincia =="araba":
        provincia="álava"
    elif provincia =="bizkaia":
        provincia="vizcaya"
    elif provincia =="girona":
        provincia="gerona"
    elif provincia =="lleida":
        provincia="lérida"
    elif provincia =="ourense":
        provincia="orense"
    elif provincia =="vàlencia":
        provincia="valencia"
    # print(provincia)

    tablaProvincias = soup.find_all('li') #almaceno todos los li's de la web
    for item in tablaProvincias:
        #obtengo el texto del link y el link para cada provicia
        name = item.find('a').text
        name = name.lower()
        name = re.sub('provincia de ','',name)
        name = re.sub('comunidad autónoma de las islas ','',name)
        name = re.sub('comunidad autónoma de ','',name)
        name = re.sub('ciudad autónoma de ','',name)
        name = re.sub('comunidad de ','',name)
        name = re.sub('comunidad foral de ','',name)
        name = re.sub('región de ','',name)
        name = re.sub('principado de ','',name)
        if "/" in name:
            reg = re.match('(.*) \/.*',name)
            name = reg.group(1)
        # print(name)
        #digo se si ha encontrado la provinica o no
        if (name == provincia):
            link = item.find('a')['href']
            resultadoProvincia=True
            searchMunicipios(URL,name,link, municipio)
            break

    # if resultadoProvincia==False:
        # print("Provincia no encontrada")    


def searchMunicipios(URL,name,linkProvincia, municipio):
    #obtengo los links de los municipios de la provincia
    linkProvincia = URL+linkProvincia
    resultadoMunicipio=False
    proviniciaPage = requests.get(linkProvincia)
    htmlProvinciaPage = BeautifulSoup(proviniciaPage.content, 'html.parser')
    # print("Encoding method :",htmlProvinciaPage.original_encoding)
    # encoding = htmlProvinciaPage.original_encoding
    # htmlProvinciaPage = BeautifulSoup(proviniciaPage.content, 'html.parser', from_encoding=encoding)
    # test = htmlProvinciaPage.prettify("utf-8")
    # print(test)
    aux = htmlProvinciaPage.find_all('table', width="700")
    tablaMunicipios = aux[0].find_all('a')
    #busco el municipio dentor de la provincia
    # municipio = input("Introduce el nombre del municipio (con minúsculas y tilde): ")
    for item in tablaMunicipios:
        name = item.text
        name = name.lower()
        municipio = municipio.lower()
        name = name[8:]
        # print(name)
        if (name == municipio):
            link = item['href']
            resultadoMunicipio=True
            showSupermercados(URL,link)
            break
    # if resultadoMunicipio==False:
    #     print("Municipio no encontrado") 


def showSupermercados(URL, link):
    supermercados = []
    linkMunicipio = URL + link
    
    try:
        municipioPage = requests.get(linkMunicipio)
        htmlMunicipio = BeautifulSoup(municipioPage.content, 'html.parser', from_encoding="utf-8")
        # print("Encoding method :",htmlMunicipio.original_encoding)
        divsSupers = htmlMunicipio.find_all('div', style="text-align:left;background:#E9F2F2;border:1px solid #bad8db;margin-left:5px;margin-bottom:5px;padding:5px;min-height:50px;width:300px;")
        #print(divsSupers)
        json ='['
        for supermercado in divsSupers:
        #obtengo los datos para cada uno de los supermercados
            nombre = supermercado.find('b').text
            divMunicipio = supermercado.contents
            distancia = float(divMunicipio[3][13:len(divMunicipio[3])-3])
            direccion = divMunicipio[8]

            #meto datos en la lista: nombre del supermercado, direción, distancia y provincia
            tupla = (nombre, direccion, distancia)
            # print(tupla)
            json += ('{"nombre": "'+str(nombre)+'","direccion": "'+str(direccion)+'","distancia": '+str(distancia)+'},')
            supermercados.append(tupla)
        json = json[:-1]
        json += ']'
        print(json)
        # print("hola", end="")
        # return json
    except:
        # print("\nERROR en ", linkMunicipio, "\n")
        error=1 #valor random
    # if len(supermercados)==0:
    #     print("No se encontraron supermercados cercanos en ese municipio")
    
    #print(supermercados)
    # print(json)
#     # sys.stdout.flush()
# scraping('murcia', 'Alcantarilla')
scraping(sys.argv[2], sys.argv[1])
# print('{"provincia": "' + sys.argv[2] + '", "municipio": "' + sys.argv[1] + '"}')
sys.stdout.flush()
