import requests
import re
from bs4 import BeautifulSoup
import sys

media=0
i=0
def scraping(provincia, pueblo):

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
    pueblo = pueblo.lower()
    # provincia = input("Introduzca provincia: (minúsculas y con tildes)")
    # pueblo = input("Introduzca municipio: (minúsculas y con tildes)")
    URL = 'http://www.buscorestaurantes.com/filtrar-ubicacion-en/'+provincia
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    soup = soup.find(attrs={"class": "block-level"})
    soup = soup.find_all('li')
    for item in soup:
        link = item.find('a')['href']
        name = item.find('a').text
        name = name.lower()
        name = re.sub('\t', '', name) 
        name = re.sub('\n', '', name)
        name = re.sub('restaurantes en ', '', name)
        if (name == pueblo):
            ws_pueblo(link)
    return None 

def ws_pueblo(link):

    while link != '':
        URL = link
        page = requests.get(URL)
        soup = BeautifulSoup(page.content, 'html.parser')
        lista = soup.find(attrs={"class": "listado-items"})
        lista = lista.find_all(attrs={"class": "listing-item-title"})
        for item in lista:
            link = item.a['href']
            ws_restaurant(link)
        nextPage = soup.find(attrs={"class": "next"}).a['href']
        link = nextPage
    return None

def ws_restaurant(link):
    global media
    global i
    URL = link
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    nombre = soup.find(attrs={"itemprop": "name"}).text
    # print('+Restaurante: ',nombre)
    # print('--------------')
    soup = soup.find_all(attrs={"class": "excerpt"})
    for item in soup:
        opinion = item.text
        opinion = re.sub('\n\s*', '', opinion)
        # print('-Opinión: ', opinion)
        # print(getSentiment(opinion))
        media+=getSentiment(opinion)
        i+=1
        # print('--------------')
    return None

from textblob import TextBlob

def getSentiment(textInput):
    analysis = TextBlob(textInput)
    language = analysis.detect_language()
    if language != 'en':
        analysis= analysis.translate(to='en')
    # print(analysis)
    analysisPol = analysis.sentiment.polarity
    analysisSub = analysis.sentiment.subjectivity
    # print(f'Tiene una polaridad de {analysisPol} y una subjectibidad de {analysisSub}')
    return analysisPol

scraping(sys.argv[2], sys.argv[1])
# scraping('provincia de malaga','Archidona')
try:
    media=media/i
    print('{"media": '+str(round(media, 2))+'}')
except:
    print('{"media": 2}') #2 = ERROR para insercción en BBDD

sys.stdout.flush()
