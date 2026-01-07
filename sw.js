// Mude para v2, v3, etc., sempre que atualizar o código do site!
const CACHE_NAME = 'sistema-despesas-v1';

// Lista de todos os arquivos que devem ser salvos no celular para carregar rápido
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './recuperar.html',
  './recuperar.js',
  './recuperar_senha.html',
  './recuperar_senha.js',
  './icon-192.png',
  './icon-512.png'
];

// Instalação do Service Worker e cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos salvos em cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação e limpeza de caches antigos se a versão mudou
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta as requisições: se tiver no cache, usa ele; se não, vai na internet
self.addEventListener('fetch', event => {
  // Não cacheia chamadas para a API do Google Script
  if (event.request.url.includes('script.google.com')) {
      return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrar, senão faz a requisição na rede
        return response || fetch(event.request);
      })
  );
});