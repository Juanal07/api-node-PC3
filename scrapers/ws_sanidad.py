import csv
import mariadb
import sys  

def scrap():
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
    errores = 0

    #Centros atención primaria
    cont = 0
    with open('csv\/20210502_Centros_de_Atencion_Primaria.csv', newline='', encoding='utf-8') as csvfile:
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
                cur.execute("SELECT idMunicipality FROM municipality WHERE name=?", (municipio,))
                for (idMunicipality) in cur:
                    idMunicipio = idMunicipality[0]
                    print(idMunicipio)
                try:
                    cur.execute("INSERT INTO medicalcenter(name,type,address,idMunicipality) VALUES"+
                    "(?,?,?,?)",(name,tipo,address,idMunicipality[0]))
                except:
                    errores +=1
                    print("ERROR")
            cont += 1

    #Hospitales
    cont = 0
    with open('csv\/20210502_Catalogo_de_Hospitales.csv', newline='', encoding='utf-8') as csvfile:
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
                cur.execute("SELECT idMunicipality FROM municipality WHERE name=?", (municipio,))
                for (idMunicipality) in cur:
                    idMunicipio = idMunicipality[0]
                    print(idMunicipio)
                try:
                    cur.execute("INSERT INTO medicalcenter(name,type,address,idMunicipality) VALUES"+
                    "(?,?,?,?)",(name,tipo,address,idMunicipality[0]))
                except:
                    errores +=1
                    print("ERROR")
            cont += 1

    #Centros de Urgencias
    cont = 0
    with open('csv\/20210502_Dispositivos_de_Urgencia_Extrahospitalaria.csv', newline='', encoding='utf-8') as csvfile:
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
                cur.execute("SELECT idMunicipality FROM municipality WHERE name=?", (municipio,))
                for (idMunicipality) in cur:
                    idMunicipio = idMunicipality[0]
                    print(idMunicipio)
                try:
                    cur.execute("INSERT INTO medicalcenter(name,type,address,idMunicipality) VALUES"+
                    "(?,?,?,?)",(name,tipo,address,idMunicipality[0]))
                except:
                    errores +=1
                    print("ERROR")
            cont += 1

    print("Errores: ",errores)
    conn.commit()
    conn.close()
    return None