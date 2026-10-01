console.log(
    "detalle-obra.js conectado"
);

const parametros =
    new URLSearchParams(
        window.location.search
    );

const obraId =
    parametros.get("id");

const contenedorDetalle =
    document.getElementById(
        "contenedor-detalle"
    );

async function cargarDetalleObra() {

    if (!obraId) {

        contenedorDetalle.innerHTML = `

            <h2>Obra no encontrada</h2>
            <a href="index.html#galeria" class="boton-principal">Volver a la galería </a>

        `;

        return;
    }


    const {
        data: obra,
        error
    } =
        await clienteSupabase
            .from("obras")
            .select("*")
            .eq(
                "id",
                obraId
            )
            .single();


    if (error || !obra) {

        console.error(error);

        contenedorDetalle.innerHTML = `

            <h2>Obra no encontrada</h2>

            <p>
                No fue posible encontrar
                la obra solicitada.
            </p>

            <a href="index.html#galeria"class="boton-principal"> Volver a la galería</a>

        `;

        return;
    }


    contenedorDetalle.innerHTML = `
        <article class="detalle-contenido">
            <div class="detalle-imagen">
                <img src="${obra.imagen_url || ""}"alt="${obra.titulo}">
            </div>
            <div class="detalle-informacion">
                <h2> ${obra.titulo}</h2>

                <p>
                    <strong>Autor:</strong>
                    ${obra.autor}
                </p>

                <p>
                    <strong>Técnica:</strong>
                    ${obra.tecnica}
                </p>

                <p>
                    <strong>Año:</strong>
                    ${obra.anio}
                </p>
                <h3>Descripción</h3>

                <p>
                    ${obra.descripcion || "Sin descripción"}
                </p>
                <a href="index.html#galeria"class="boton-principal">Volver a la galería</a>
            </div>
        </article>

    `;
}
cargarDetalleObra();