const { createApp } = Vue;
createApp({
  data() {
    return {
      productos: [],
      // esto es para el boton modificar +(location.search.substr(4)===""?'':"/")+location.search.substr(4)
      url:
        "https://jernocas.pythonanywhere.com/productos" +
        (location.search.substr(4) === "" ? "" : "/") +
        location.search.substr(4),
      error: false,
      cargando: true,
      /*alta*/
      id: 0,
      nombre: "",
      imagen: "",
      stock: 0,
      precio: 0,
      categoria: 0,
    };
  },
  methods: {
    fetchData(url) {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.productos = data;
          this.cargando = false;
          // esto es para boton modificar
          this.id = data.id;
          this.nombre = data.nombre;
          this.imagen = data.imagen;
          this.stock = data.stock;
          this.precio = data.precio;
          this.categoria = data.categoria;
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
    eliminar(id) {
      const url = "https://jernocas.pythonanywhere.com/productos/" + id;
      var options = {
        method: "DELETE",
      };
      fetch(url, options)
        .then((res) => res.text()) // or res.json()
        .then((res) => {
          location.reload();
        });
    },
    grabar() {
      let producto = {
        nombre: this.nombre,
        precio: this.precio,
        stock: this.stock,
        imagen: this.imagen,
        categoria: this.categoria,
      };
      var options = {
        body: JSON.stringify(producto),
        method: "POST",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };
      fetch(this.url, options)
        .then(function () {
          alert("Registro grabado");
          window.location.href = "./productos.html";
        })
        .catch((err) => {
          console.error(err);
          alert("Error al Grabar");
        });
    },
    modificar() {
      let producto = {
        nombre: this.nombre,
        precio: this.precio,
        stock: this.stock,
        imagen: this.imagen,
        categoria: this.categoria,
      };
      var options = {
        body: JSON.stringify(producto),
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        redirect: "follow",
      };
      fetch(this.url, options)
        .then(function () {
          alert("Registro modificado");
          window.location.href = "./productos.html";
        })
        .catch((err) => {
          console.error(err);
          alert("Error al Modificar");
        });
    },
  },
  created() {
    this.fetchData(this.url);
  },
}).mount("#app");


/*FILTRO POR CATEGORIA*/
const contenedorCheck = document.getElementById('checkboxes');
const input = document.querySelector('input');
let productos; 

async function getProductos() {
  await fetch("https://jernocas.pythonanywhere.com/productos")
    .then(response => response.json())
    .then(data => {
      productos = data;
      createCheckboxes(productos);
      contenedorCheck.addEventListener('change', function() {
        const productosFiltrados = filterByCategory(productos);
      });
      input.addEventListener('input', function() {
        const valorInput = input.value.toLowerCase();
        const productosFiltrados = filterByInput(productos, valorInput);
      });
      return productos;
    })
    .catch(error => console.error('Error fetching data:', error));
}

getProductos();

function createCheckboxes(array) {
  let arrayCategories = array.map(producto => producto.categoria);
  let setCategory = new Set(arrayCategories);
  let arrayChecks = Array.from(setCategory);
  let checkbody = '';

  arrayChecks.forEach(categoria => {
    checkbody +=
      `<div id="checkbox">
        <input type="checkbox" role="switch" id="${categoria}" value="${categoria.toLowerCase()}">
        <label for="${categoria}">${categoria}</label>
      </div>`;
  });

  contenedorCheck.innerHTML = checkbody;
}

function filterByCategory(array) {
  let checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
  let selectedCategories = Array.from(checkboxes).map(checkbox => checkbox.value.toLowerCase());
  let filteredArray = array.filter(producto => selectedCategories.includes(producto.categoria.toLowerCase()));
  return filteredArray.length > 0 ? filteredArray : array;
}

function filterByInput(array, inputValue) {
  let filteredArray = array.filter(producto => producto.nombre.toLowerCase().includes(inputValue));
  return filteredArray.length > 0 ? filteredArray : array;
}
