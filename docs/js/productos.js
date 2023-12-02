const { createApp } = Vue;
createApp({
  data() {
    return {
      productos: [],
      // esto es para el boton modificar +(location.search.substr(4)===""?'':"/")+location.search.substr(4)
      url:
        "https://casellajeronimo.pythonanywhere.com/productos" +
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
        })
        .catch((err) => {
          console.error(err);
          this.error = true;
        });
    },
    eliminar(id) {
      const url = "https://casellajeronimo.pythonanywhere.com/productos/" + id;
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
          alert("Error al Grabarr");
        });
    },
    modificar() {
      let producto = {
        nombre: this.nombre,
        precio: this.precio,
        stock: this.stock,
        imagen: this.imagen,
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
