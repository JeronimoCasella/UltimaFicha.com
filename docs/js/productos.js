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

    //FILTRO POR CATEGORIA
    computed: {
      categoriaFiltrada() {
        return [...new Set(this.productos.map((producto) => this.categoria))];
      },
      productosFiltrados() {
        return this.categoriaSeleccionada.length > 0
          ? this.productos.filter((producto) =>
              this.categoriaSeleccionada.includes(this.categoria)
            )
          : this.productos;
      },
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
