console.log("mis-obras.js conectado");


const contenedorMisObras =
    document.getElementById(
        "contenedor-mis-obras"
    );


async function cargarMisObras() {

    const {
        data: { user },
        error: errorUsuario
    } =
        await clienteSupabase.auth.getUser();


    if (errorUsuario || !user) {

        alert(
            "Debes iniciar sesión para administrar tus obras"
        );

        window.location.href =
            "login.html";

        return;
    }


    const {
        data: obras,
        error
    } =
        await clienteSupabase
            .from("obras")
            .select("*")
            .eq(
                "usuario_id",
                user.id
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        contenedorMisObras.innerHTML =
            "<p>No se pudieron cargar tus obras.</p>";

        return;
    }


    contenedorMisObras.innerHTML = "";


    if (!obras || obras.length === 0) {

        contenedorMisObras.innerHTML = `

            <div class="mensaje-vacio">

                <p>
                    Todavía no has publicado ninguna obra.
                </p>

                <a
                    href="publicar.html"
                    class="boton-principal"
                >
                    Publicar mi primera obra
                </a>

            </div>

        `;

        return;
    }


    obras.forEach(function (obra) {

        const tarjeta =
            document.createElement("article");

        tarjeta.classList.add(
            "tarjeta-obra"
        );


        tarjeta.innerHTML = `

            <img
                src="${obra.imagen_url || ""}"
                alt="${obra.titulo}"
            >

            <div class="contenido-tarjeta">

                <h3>
                    ${obra.titulo}
                </h3>

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

                <div class="acciones-obra">

                    <a
                        href="editar-obra.html?id=${obra.id}"
                        class="btn-editar"
                    >
                        Editar
                    </a>

                    <button
                        type="button"
                        class="btn-eliminar"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        `;


        const botonEliminar =
            tarjeta.querySelector(
                ".btn-eliminar"
            );


        botonEliminar.addEventListener(
            "click",
            function () {

                eliminarObra(
                    obra,
                    user
                );
            }
        );


        contenedorMisObras.appendChild(
            tarjeta
        );
    });
}


async function eliminarObra(
    obra,
    user
) {

    if (obra.usuario_id !== user.id) {

        alert(
            "No tienes permiso para eliminar esta obra"
        );

        return;
    }

    const confirmar =
        confirm(
            `¿Seguro que deseas eliminar "${obra.titulo}"?`
        );


    if (!confirmar) {
        return;
    }

    const {
        data,
        error
    } =
        await clienteSupabase
            .from("obras")
            .delete()
            .eq(
                "id",
                obra.id
            )
            .eq(
                "usuario_id",
                user.id
            )
            .select();

    if (
        error ||
        !data ||
        data.length === 0
    ) {

        console.error(error);

        alert(
            "No se pudo eliminar la obra"
        );

        return;
    }

    if (obra.imagen_url) {

        const partes =
            obra.imagen_url.split(
                "/storage/v1/object/public/obras/"
            );

        if (partes.length > 1) {

            const ruta =
                decodeURIComponent(
                    partes[1]
                );


            const {
                error: errorImagen
            } =
                await clienteSupabase.storage
                    .from("obras")
                    .remove([
                        ruta
                    ]);


            if (errorImagen) {

                console.error(
                    "No se pudo eliminar la imagen:",
                    errorImagen
                );
            }
        }
    }

    alert(
        "Obra eliminada correctamente"
    );

    cargarMisObras();
}

cargarMisObras();