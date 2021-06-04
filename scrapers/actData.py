import requests
from bs4 import BeautifulSoup
import mariadb
import sys
import csv

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

def actData():
    # Conexión con BBDD
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
    # enlace de prueba reducido
    # URL = 'https://15mpedia.org/w/index.php?title=Especial:Ask&offset=0&limit=20&q=%5B%5BPage+has+default+form%3A%3AMunicipio%5D%5D+%5B%5Bpa%C3%ADs%3A%3AEspa%C3%B1a%5D%5D&p=format%3Dtable%2Fmainlabel%3DMunicipio&po=%3F%3DMunicipio%23%0A%3FComarca%23-%0A%3FProvincia%0A%3FComunidad+aut%C3%B3noma%3DCC.AA.%0A%3FAltitud%3DAltitud+%28m.s.n.m.%29%0A%3FSuperficie%3DSuperficie+%28km%C2%B2%29%0A%3FPoblaci%C3%B3n+en+2019%3DPoblaci%C3%B3n+%282019%29%0A%3FDensidad+de+poblaci%C3%B3n%3DDensidad+%28hab.%2Fkm%C2%B2%29%0A&sort=nombre&order=asc'
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    tabla = soup.find("tbody")
    tabla = tabla.find_all("tr")
    for i in tabla:
        # ----Municipio----
        municipio = i.find(class_="Municipio")
        municipioStr = municipio.text
        # print('Municipio - ' + municipioStr)
        if municipioStr != "Madrid (desambiguación)":
            print('Municipio - ' + municipioStr)
            # ----Escudo----
            link = municipio.find('a')['href']
            # escudo = shield(link)
            # ----Comarca----
            comarca = i.find(class_="Comarca")
            if comarca == None:
                comarca = None
            else:
                comarca = comarca.text
            print('Comarca - ', comarca)
            # ----Provincia----
            provincia = i.find(class_="Provincia")
            provincia = provincia.text
            print('Provincia - ' + provincia)
            # ----CCAA----
            CCAA = i.find(class_="CC.AA.")
            CCAA = CCAA.text
            print('CCAA - ' + CCAA)
            # ----Altitud----
            altitud = i.find(class_="Altitud-(m.s.n.m.)")
            if altitud == None:
                altitudFloat = None
            else:
                altitud = altitud.text
                alt = altitud.replace(".", "")
                alti = alt.replace(",", ".")
                # altitud = re.sub('.','',altitud)
                altitudFloat = float(alti)
            print('Altitud - ', altitudFloat, ' m.s.n.m')
            # ----Superficie----
            superficie = i.find(class_="Superficie-(km²)")
            if superficie == None:
                superficieFloat = None
            else:
                superficie = superficie.text
                sup = superficie.replace(".", "")
                supe = sup.replace(",", ".")
                superficieFloat = float(supe)
            print('Superficie - ', superficieFloat, ' km²')
            # ----Poblacion----
            poblacion = i.find(class_="Población-(2019)")
            if poblacion == None:
                poblacionInt = None
            else:
                poblacion = poblacion.text
                pob = poblacion.replace(".", "")
                poblacionInt = int(pob)
            print('Poblacion - ', poblacionInt, ' habitantes ')
            # ----Densidad----
            densidad = i.find(class_="Densidad-(hab./km²)")
            if densidad == None:
                densidadFloat = None
            else:
                densidad = densidad.text
                den = densidad.replace(".", "")
                dend = den.replace(",", ".")
                densidadFloat = float(dend)
            print('Densidad - ', densidadFloat, ' hab./km²')
            print('-----------------------------------')

            idMunicipality = 0
            idMunicipio = 0
            cur.execute("SELECT idMunicipality FROM municipality_copy WHERE name=?", (municipioStr,))
            for (idMunicipality) in cur:
                idMunicipio = idMunicipality[0]
                print(idMunicipio)
            if idMunicipio == 0:
                print("procedo a insertar el municipio")
                try:
                    escudo = shield(link)
                    cur.execute("INSERT INTO municipality_copy(name,shield,region,province,ccaa,population,surface," +
                            "altitude,density) VALUES (?,?,?,?,?,?,?,?,?)",
                        (municipioStr, escudo, comarca, provincia, CCAA, poblacionInt, superficieFloat, altitudFloat, densidadFloat))
                    # conn.commit()
                    # print("Insertado")
                except mariadb.Error as e:
                    print(f"Error: {e}")
            else:
                popBD = 0
                supBD = 0.0
                altBD = 0.0
                denBD = 0.0
                print("actualizo datos o no segun necesario")
                cur.execute("SELECT population, surface, altitude, density FROM municipality_copy WHERE idMunicipality=?", (idMunicipio,))
                for (popQ, supQ, altQ, denQ) in cur:
                    popBD = popQ
                    supBD = supQ
                    altBD = altQ
                    denBD = denQ
                #comparamos los datos de la BBDD con los de la tabla
                if (popBD!=poblacionInt):
                    print("a cambiar")
                    cur.execute("UPDATE municipality_copy SET population=? WHERE idMunicipality=?", (poblacionInt,idMunicipio))
                    # conn.commit()
                    # exit(0)
                if (supBD!=superficieFloat):
                    print("a cambiar")
                    cur.execute("UPDATE municipality_copy SET surface=? WHERE idMunicipality=?", (superficieFloat,idMunicipio))
                if (altBD!=altitudFloat):
                    print("a cambiar")
                    cur.execute("UPDATE municipality_copy SET altitude=? WHERE idMunicipality=?", (altitudFloat,idMunicipio))
                if (denBD!=densidadFloat):
                    print("a cambiar")
                    cur.execute("UPDATE municipality_copy SET density=? WHERE idMunicipality=?", (densidadFloat,idMunicipio))
                
    conn.commit()

    #al terminar la revision de los pueblos actualizamos los centros médicos y estaciones a las nuevas IDs
    cur.execute("DELETE FROM station_copy")
    errores = 0
    with open('scrapers\listado-estaciones-completo-sel.csv', newline='', encoding='utf-8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=';')
        for row in spamreader:
            code = row[0]
            name = row[1]
            dir = row[2]
            city:str = row[3]
            cercanias = row[4]
            if cercanias=="SI":
                cercaniasInt = 1
            else:
                cercaniasInt = 0
            feve = row[5]
            if feve =="NO":
                feveInt = 0
            else:
                feveInt = 1
            print(code,", ",name,", ",name,", ",dir,", ",city,", ",cercaniasInt,", ",feveInt)
            idMunicipality = 0
            cur.execute("SELECT idMunicipality FROM municipality_copy WHERE name=?", (city,))
            for (idMunicipality) in cur:
                idMunicipio = idMunicipality[0]
                print(idMunicipio)
            try:
                cur.execute("INSERT INTO station_copy(cercanias,feve,name,address,idMunicipality) VALUES"+
                "(?,?,?,?,?)",(cercaniasInt,feveInt,name,dir,idMunicipality[0]))
            except:
                errores +=1
                print("ERROR")
            # print(', '.join(row))
            
    print("Errores: ",errores)
    conn.commit()

    #ahora pasamos a centros medicos
    cur.execute("DELETE FROM medicalcenter_copy")
    errores = 0

    #Centros atención primaria
    cont = 0
    with open('scrapers\/20210502_Centros_de_Atencion_Primaria.csv', newline='', encoding='utf-8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=';')
        for row in spamreader:
            # print(', '.join(row))
            if cont != 0:
                name = row[0]
                municipio = row[3]
                address = row[5]
                tipo = row[12]
                print(name," ",municipio," ",address," ",tipo)
                idMunicipality = 0
                cur.execute("SELECT idMunicipality FROM municipality_copy WHERE name=?", (municipio,))
                for (idMunicipality) in cur:
                    idMunicipio = idMunicipality[0]
                    print(idMunicipio)
                try:
                    cur.execute("INSERT INTO medicalcenter_copy(name,type,address,idMunicipality) VALUES"+
                    "(?,?,?,?)",(name,tipo,address,idMunicipality[0]))
                except:
                    errores +=1
                    print("ERROR")
            cont += 1

    #Hospitales
    cont = 0
    with open('scrapers\/20210502_Catalogo_de_Hospitales.csv', newline='', encoding='utf-8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=';')
        for row in spamreader:
            # print(', '.join(row))
            if cont != 0:
                name = row[2]
                municipio = row[5]
                address = row[6]
                tipo = row[10]
                print(name," ",municipio," ",address," ",tipo)
                idMunicipality = 0
                cur.execute("SELECT idMunicipality FROM municipality_copy WHERE name=?", (municipio,))
                for (idMunicipality) in cur:
                    idMunicipio = idMunicipality[0]
                    print(idMunicipio)
                try:
                    cur.execute("INSERT INTO medicalcenter_copy(name,type,address,idMunicipality) VALUES"+
                    "(?,?,?,?)",(name,tipo,address,idMunicipality[0]))
                except:
                    errores +=1
                    print("ERROR")
            cont += 1

    #Centros de Urgencias
    cont = 0
    with open('scrapers\/20210502_Dispositivos_de_Urgencia_Extrahospitalaria.csv', newline='', encoding='utf-8') as csvfile:
        spamreader = csv.reader(csvfile, delimiter=';')
        for row in spamreader:
            # print(', '.join(row))
            if cont != 0:
                name = row[3]
                municipio = row[1]
                address = row[4]
                tipo = "Dispositivos de Urgencia Extrahospitalaria"
                print(name," ",municipio," ",address," ",tipo)
                idMunicipality = 0
                cur.execute("SELECT idMunicipality FROM municipality_copy WHERE name=?", (municipio,))
                for (idMunicipality) in cur:
                    idMunicipio = idMunicipality[0]
                    print(idMunicipio)
                try:
                    cur.execute("INSERT INTO medicalcenter_copy(name,type,address,idMunicipality) VALUES"+
                    "(?,?,?,?)",(name,tipo,address,idMunicipality[0]))
                except:
                    errores +=1
                    print("ERROR")
            cont += 1

    print("Errores: ",errores)

    conn.commit()
    conn.close()
    return None

#Función main a ejecutar
actData()
