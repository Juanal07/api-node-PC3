import requests
import re
from bs4 import BeautifulSoup

def scraping():

    provincia = input("Introduzca provincia: (minúsculas y con tildes)")
    pueblo = input("Introduzca municipio: (minúsculas y con tildes)")
    URL = 'http://www.buscorestaurantes.com/filtrar-ubicacion-en/'+provincia
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    soup = soup.find(attrs={"class": "block-level"})
    soup = soup.find_all('li')
    # TODO refactor a while
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

    URL = link
    page = requests.get(URL)
    soup = BeautifulSoup(page.content, 'html.parser')
    nombre = soup.find(attrs={"itemprop": "name"}).text
    print('+Restaurante: ',nombre)
    print('--------------')
    soup = soup.find_all(attrs={"class": "excerpt"})
    for item in soup:
        opinion = item.text
        opinion = re.sub('\n\s*', '', opinion)
        print('-Opinión: ', opinion)
        print('--------------')
    return None

