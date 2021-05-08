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
    with open('csv\listado-estaciones-completo-sel.csv', newline='', encoding='utf-8') as csvfile:
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
            cur.execute("SELECT idMunicipality FROM municipality WHERE name=?", (city,))
            for (idMunicipality) in cur:
                idMunicipio = idMunicipality[0]
                print(idMunicipio)
            try:
                cur.execute("INSERT INTO station(cercanias,feve,name,address,idMunicipality) VALUES"+
                "(?,?,?,?,?)",(cercaniasInt,feveInt,name,dir,idMunicipality[0]))
            except:
                errores +=1
                print("ERROR")
            # print(', '.join(row))
            
    print("Errores: ",errores)
    conn.commit()
    conn.close()
    return None