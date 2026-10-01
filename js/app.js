console.log("app.js conectado");

const contenedorObras =
    document.getElementById(
        "contenedor-obras"
    );


const buscador =
    document.getElementById(
        "buscar-obras"
    );


const contador =
    document.getElementById(
        "contador-obras"
    );


const botonesFiltro =
    document.querySelectorAll(
        ".filtro"
    );


let todasLasObras = [];

let filtroActual = "todos";

async function cargarObras() {

    const {
        data: obras,
        error
    } =
        await clienteSupabase
            .from("obras")
            .select("*")
            .order(
                "es_obra_original",
                {
                    ascending: false
                }
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Error al cargar obras:",
            error
        );


        contenedorObras.innerHTML = `
            <p>
                No se pudieron cargar las obras.
            </p>
        `;


        contador.textContent =
            "No fue posible cargar la colección";


        return;
    }


    todasLasObras =
        obras || [];


    mostrarObras(
        todasLasObras
    );
}

function mostrarObras(obras) {

    contenedorObras.innerHTML = "";


    contador.textContent =
        `${obras.length} obra${obras.length === 1 ? "" : "s"} encontrada${obras.length === 1 ? "" : "s"}`;


    if (obras.length === 0) {

        contenedorObras.innerHTML = `

            <div class="sin-resultados">

                <h3>
                    No encontramos obras
                </h3>

                <p>
                    Intenta realizar otra búsqueda
                    o seleccionar un filtro diferente.
                </p>

            </div>

        `;

        return;
    }


    obras.forEach(function (obra) {

        crearTarjeta(
            obra
        );
    });
}

function crearTarjeta(obra) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.classList.add(
        "tarjeta-obra"
    );


    const anio =
        obra.anio ||
        "No especificado";


    tarjeta.innerHTML = `

        <div class="imagen-tarjeta">

            <img
                src="${obra.imagen_url || ""}"
                alt="${obra.titulo || "Obra ecuatoriana"}"
                loading="lazy"
            >

            ${
                obra.es_obra_original
                    ? `
                        <span class="insignia">
                            Colección ECUArte
                        </span>
                    `
                    : `
                        <span class="insignia comunidad">
                            Comunidad
                        </span>
                    `
            }

        </div>


        <div class="contenido-tarjeta">

            <h3>
                ${obra.titulo || "Sin título"}
            </h3>


            <p>
                <strong>Autor:</strong>
                ${obra.autor || "No especificado"}
            </p>


            <p>
                <strong>Técnica:</strong>
                ${obra.tecnica || "No especificada"}
            </p>


            <p>
                <strong>Año:</strong>
                ${anio}
            </p>


            <a
                href="detalle-obra.html?id=${obra.id}"
                class="boton-principal"
            >
                Ver detalles
            </a>

        </div>

    `;


    contenedorObras.appendChild(
        tarjeta
    );
}

buscador.addEventListener(
    "input",
    aplicarFiltros
);

botonesFiltro.forEach(
    function (boton) {

        boton.addEventListener(
            "click",
            function () {

                botonesFiltro.forEach(
                    function (otroBoton) {

                        otroBoton.classList.remove(
                            "activo"
                        );
                    }
                );


                boton.classList.add(
                    "activo"
                );


                filtroActual =
                    boton.dataset.filtro;


                aplicarFiltros();
            }
        );
    }
);

function aplicarFiltros() {

    const texto =
        buscador.value
            .trim()
            .toLowerCase();


    const resultado =
        todasLasObras.filter(
            function (obra) {

                const titulo =
                    (obra.titulo || "")
                        .toLowerCase();


                const autor =
                    (obra.autor || "")
                        .toLowerCase();


                const tecnica =
                    (obra.tecnica || "")
                        .toLowerCase();


                const coincideBusqueda =
                    titulo.includes(texto) ||
                    autor.includes(texto) ||
                    tecnica.includes(texto);


                let coincideFiltro =
                    true;


                if (
                    filtroActual !==
                    "todos"
                ) {

                    coincideFiltro =
                        tecnica.includes(
                            filtroActual
                        );
                }


                return (
                    coincideBusqueda &&
                    coincideFiltro
                );
            }
        );


    mostrarObras(
        resultado
    );
}

cargarObras();