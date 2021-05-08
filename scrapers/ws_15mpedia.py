import requests
from bs4 import BeautifulSoup
import mariadb
import sys

def shield(link):
    URL = 'https://15mpedia.org' + link
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    link = soup.find('a', class_="image")['href']
    page = requests.get('https://15mpedia.org' + link)
    soup = BeautifulSoup(page.content, 'html.parser')
    link = soup.find(class_="fullImageLink")
    link = link.find('a')['href']
    print('Escudo - ' + link)
    return link

def scraping():
    #Conexión con BBDD
    try:
        conn = mariadb.connect(
            user="pr_softlusion",
            password="Softlusion",
            host="2.139.176.212",
            port=3306,
            database="prsoftlusion"
        )
        print("Conexión a BBDD")
    except mariadb.Error as e:
        print(f"Error connecting to MariaDB Platform: {e}")
        sys.exit(1)

    # Get Cursor
    cur = conn.cursor()
    
    URL = 'https://15mpedia.org/w/index.php?title=Especial:Ask&offset=0&limit=8134&q=%5B%5BPage+has+default+form%3A%3AMunicipio%5D%5D+%5B%5Bpa%C3%ADs%3A%3AEspa%C3%B1a%5D%5D&p=format%3Dtable%2Fmainlabel%3DMunicipio&po=%3F%3DMunicipio%23%0A%3FComarca%23-%0A%3FProvincia%0A%3FComunidad+aut%C3%B3noma%3DCC.AA.%0A%3FAltitud%3DAltitud+%28m.s.n.m.%29%0A%3FSuperficie%3DSuperficie+%28km%C2%B2%29%0A%3FPoblaci%C3%B3n+en+2019%3DPoblaci%C3%B3n+%282019%29%0A%3FDensidad+de+poblaci%C3%B3n%3DDensidad+%28hab.%2Fkm%C2%B2%29%0A&sort=nombre&order=asc'
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    tabla = soup.find("tbody")
    tabla = tabla.find_all("tr")
    for i in tabla:
        #----Municipio----
        municipio = i.find(class_="Municipio")
        municipioStr = municipio.text
        # print('Municipio - ' + municipioStr)
        if municipioStr != "Madrid (desambiguación)":
            print('Municipio - ' + municipioStr)
            #----Escudo----
            link = municipio.find('a')['href']
            escudo = shield(link)
            #----Comarca----
            comarca = i.find(class_="Comarca")
            if comarca == None:
                comarca = None
            else:
                comarca = comarca.text
            print('Comarca - ', comarca)
            #----Provincia----
            provincia = i.find(class_="Provincia")
            provincia = provincia.text
            print('Provincia - ' + provincia)
            #----CCAA----
            CCAA = i.find(class_="CC.AA.")
            CCAA = CCAA.text
            print('CCAA - ' + CCAA)
            #----Altitud----
            altitud = i.find(class_="Altitud-(m.s.n.m.)")
            if altitud == None:
                altitudFloat = None
            else:
                altitud = altitud.text
                alt = altitud.replace(".","")
                alti = alt.replace(",",".")
                # altitud = re.sub('.','',altitud)
                altitudFloat = float(alti)
            print('Altitud - ', altitudFloat, ' m.s.n.m')
            #----Superficie----
            superficie = i.find(class_="Superficie-(km²)")
            if superficie == None:
                superficieFloat = None
            else:
                superficie = superficie.text
                sup = superficie.replace(".","")
                supe = sup.replace(",",".")
                superficieFloat = float(supe)
            print('Superficie - ', superficieFloat, ' km²')
            #----Poblacion----
            poblacion = i.find(class_="Población-(2019)")
            if poblacion == None:
                poblacionInt = None
            else:
                poblacion = poblacion.text
                pob = poblacion.replace(".","")
                poblacionInt = int(pob)
            print('Poblacion - ', poblacionInt, ' habitantes ')
            #----Densidad----
            densidad = i.find(class_="Densidad-(hab./km²)")
            if densidad == None:
                densidadFloat = None
            else:
                densidad = densidad.text
                den = densidad.replace(".","")
                dend = den.replace(",",".")
                densidadFloat = float(dend)
            print('Densidad - ', densidadFloat, ' hab./km²')
            print('-----------------------------------')
            try:
                cur.execute("INSERT INTO municipality(name,shield,region,province,ccaa,population,surface,"+
                "altitude,density) VALUES (?,?,?,?,?,?,?,?,?)",
                (municipioStr,escudo,comarca,provincia,CCAA,altitudFloat,superficieFloat,poblacionInt,densidadFloat))
                # conn.commit()
                # print("Insertado")
            except mariadb.Error as e: 
                print(f"Error: {e}")
    conn.commit()
    conn.close()
    return None
