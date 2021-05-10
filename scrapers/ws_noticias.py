from bs4 import BeautifulSoup
import requests
import re
import sys
import json
def scraping():
   Pueblo = input('Introduzca un municipio: ')
   #Pueblo = 'villaviciosa de odon'
   url = 'https://www.20minutos.es/busqueda//?q='+Pueblo+'&sort_field=&category=&publishedAt%5Bfrom%5D=&publishedAt%5Buntil%5D='
   page = requests.get(url)
   soup = BeautifulSoup(page.content, 'html.parser')
   links = soup.find("section", attrs={"class": "content content-100"})
   links1 = links.find_all('div', class_='media-content')
   i=1
   textos = []
   for  item in links1:
       link2 = item.find('a')['href']
       print('----------------------'+str(i)+'------------------------------')
       # ws_articulo(link2)
       # ws_fecha(link2)
       ws_texto(link2)
       i+=1

#def ws_articulo(link):
#    try:
#        page = requests.get(link)
#        soup = BeautifulSoup(page.content, 'html.parser')
#        #print(soup)
#        titulo = soup.find('h1', class_='article-title')
#        titulo = titulo.text
#        print('Titulo: '+ titulo)   

#    except:
#        print('No se pudo scrapear')
#    return None 

#def ws_fecha(noticia):
#    try:
#        page = requests.get(noticia)
#        soup = BeautifulSoup(page.content, 'html.parser')
#        #print(soup)
#        fecha = soup.find('span', class_='article-date')
#        fecha = fecha.text
#        print('Fecha: ' + fecha)   

#    except:
#        print('No se pudo scrapear')
#    return None 

def ws_texto(titulo):
   try:
       page = requests.get(titulo)
       soup = BeautifulSoup(page.content, 'html.parser')
       texto = soup.find('div', class_="article-text")
       texto = soup.find_all('p', class_='paragraph')
       lista = []
       for  textos in texto:
           #texto1 = textos.find('a')['href']
        #    print (textos.text)
           lista.append(textos.text)
           print(lista[textos])
   except:
       print('No se pudo scrapear')
   return None    

print('{"msg": "'+str(sys.argv[1])+'"}')
sys.stdout.flush()

