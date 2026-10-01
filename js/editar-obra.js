console.log(
    "editar-obra.js conectado"
);


const parametros =
    new URLSearchParams(
        window.location.search
    );


const obraId =
    parametros.get("id");


const formularioEditar =
    document.getElementById(
        "form-editar"
    );


let obraActual = null;
let usuarioActual = null;


async function cargarObra() {

    if (!obraId) {

        alert(
            "No se indicó ninguna obra"
        );

        window.location.href =
            "mis-obras.html";

        return;
    }


    const {
        data: { user },
        error: errorUsuario
    } =
        await clienteSupabase.auth.getUser();


    if (errorUsuario || !user) {

        alert(
            "Debes iniciar sesión"
        );

        window.location.href =
            "login.html";

        return;
    }


    usuarioActual = user;


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

        alert(
            "No se pudo cargar la obra"
        );

        window.location.href =
            "mis-obras.html";

        return;
    }


    if (
        obra.usuario_id !==
        usuarioActual.id
    ) {

        alert(
            "No tienes permiso para editar esta obra"
        );

        window.location.href =
            "mis-obras.html";

        return;
    }


    obraActual = obra;


    document.getElementById(
        "titulo"
    ).value = obra.titulo;


    document.getElementById(
        "autor"
    ).value = obra.autor;


    document.getElementById(
        "tecnica"
    ).value = obra.tecnica;


    document.getElementById(
        "anio"
    ).value = obra.anio;


    document.getElementById(
        "descripcion"
    ).value =
        obra.descripcion || "";
}


formularioEditar.addEventListener(
    "submit",
    actualizarObra
);


async function actualizarObra(evento) {

    evento.preventDefault();


    if (
        !obraActual ||
        !usuarioActual
    ) {

        alert(
            "La obra todavía no está disponible"
        );

        return;
    }


    const titulo =
        document
            .getElementById("titulo")
            .value
            .trim();


    const autor =
        document
            .getElementById("autor")
            .value
            .trim();


    const tecnica =
        document
            .getElementById("tecnica")
            .value
            .trim();


    const anio =
        document
            .getElementById("anio")
            .value;


    const descripcion =
        document
            .getElementById("descripcion")
            .value
            .trim();


    const nuevaImagen =
        document
            .getElementById("imagen")
            .files[0];


    let nuevaImagenUrl =
        obraActual.imagen_url;


    let rutaNuevaImagen = null;
    let rutaImagenAnterior = null;

    if (obraActual.imagen_url) {

        const partes =
            obraActual.imagen_url.split(
                "/storage/v1/object/public/obras/"
            );


        if (partes.length > 1) {

            rutaImagenAnterior =
                decodeURIComponent(
                    partes[1]
                );
        }
    }


    if (nuevaImagen) {

        const nombreLimpio =
            nuevaImagen.name.replace(
                /[^a-zA-Z0-9._-]/g,
                "_"
            );


        rutaNuevaImagen =
            usuarioActual.id +
            "/" +
            Date.now() +
            "-" +
            nombreLimpio;


        const {
            error: errorSubida
        } =
            await clienteSupabase.storage
                .from("obras")
                .upload(
                    rutaNuevaImagen,
                    nuevaImagen
                );


        if (errorSubida) {

            console.error(errorSubida);

            alert(
                "No se pudo subir la nueva imagen"
            );

            return;
        }


        const {
            data: datosUrl
        } =
            clienteSupabase.storage
                .from("obras")
                .getPublicUrl(
                    rutaNuevaImagen
                );


        nuevaImagenUrl =
            datosUrl.publicUrl;
    }

    const {
        data,
        error
    } =
        await clienteSupabase
            .from("obras")
            .update({

                titulo: titulo,
                autor: autor,
                tecnica: tecnica,
                anio: Number(anio),
                descripcion: descripcion,
                imagen_url: nuevaImagenUrl

            })
            .eq(
                "id",
                obraId
            )
            .eq(
                "usuario_id",
                usuarioActual.id
            )
            .select();


    if (
        error ||
        !data ||
        data.length === 0
    ) {

        console.error(error);

        if (rutaNuevaImagen) {

            await clienteSupabase.storage
                .from("obras")
                .remove([
                    rutaNuevaImagen
                ]);
        }


        alert(
            "No se pudo actualizar la obra"
        );

        return;
    }

    if (
        nuevaImagen &&
        rutaImagenAnterior
    ) {

        const {
            error: errorEliminarAnterior
        } =
            await clienteSupabase.storage
                .from("obras")
                .remove([
                    rutaImagenAnterior
                ]);


        if (errorEliminarAnterior) {

            console.error(
                "La obra se actualizó, pero no se pudo eliminar la imagen anterior:",
                errorEliminarAnterior
            );
        }
    }


    alert(
        "Obra actualizada correctamente"
    );


    window.location.href =
        "mis-obras.html";
}


cargarObra();