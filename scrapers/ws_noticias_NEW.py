from bs4 import BeautifulSoup
import requests
import re
import warnings
import sys

warnings.filterwarnings('ignore')

class DevNull:
    def write(self, msg):
        pass

sys.stderr = DevNull()

#librerías de IA
import pandas as pd
import string
from nltk import word_tokenize, download
from nltk.corpus import stopwords
from nltk.stem import SnowballStemmer
download('punkt')

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

import joblib #para exportar el modelo
import pickle

def examenNoticias(municipio):
    # print('HOLLAAA')
    url = 'https://www.20minutos.es/busqueda//?q='+municipio+'&sort_field=&category=&publishedAt%5Bfrom%5D=&publishedAt%5Buntil%5D='
    page = requests.get(url)
    soup = BeautifulSoup(page.content, 'html.parser')
    links = soup.find("section", attrs={"class": "content content-100"})
    links1 = links.find_all('div', class_='media-content')

    json ='['
    # print('TODOS LOS LINKS: ', links1)
    for item1 in links1:
        link = item1.find('a')['href']
        # print('Link de cada noticias ', link)
        # print('HOLLAAA1')
        page = requests.get(link)
        # print('HOLLAAA2')
        soup = BeautifulSoup(page.content, 'html.parser')
        # print('HTML PRIMERA NOTICIA: ', soup)
        titulo = soup.find('h1', class_='article-title')
        titulo = titulo.text
        titulo = re.sub('"','',titulo)
        # print('Titulo: '+ titulo)
        fecha = soup.find('span', class_='article-date')
        fecha = fecha.text
        # print('Fecha: ' + fecha)
        json += ('{"titulo": "'+str(titulo)+'","fecha": "'+str(fecha)+'"},')
    json = json[:-1]
    json += ']'
    print(json)


try:
    examenNoticias()
except:
    print('{"titulo": "NoHay","fecha": "NoHay"}')
sys.stdout.flush()
