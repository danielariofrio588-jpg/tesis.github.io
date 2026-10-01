console.log("publicar.js está funcionando");
async function verificarUsuario() {

    const {
        data: { session }
    } = await clienteSupabase.auth.getSession();

    if (!session) {

        alert("Debes iniciar sesión para publicar una obra");

        window.location.href = "login.html";

        return;
    }

    console.log(
        "Usuario autorizado:",
        session.user.id
    );
}

verificarUsuario();

const formularioPublicar =
    document.getElementById("form-publicar");

formularioPublicar.addEventListener(
    "submit",
    publicarObra
);

async function publicarObra(evento) {

    evento.preventDefault();

    console.log("Intentando publicar obra...");

    const titulo =
        document.getElementById("titulo").value;

    const autor =
        document.getElementById("autor").value;

    const tecnica =
        document.getElementById("tecnica").value;

    const anio =
        document.getElementById("anio").value;

    const descripcion =
        document.getElementById("descripcion").value;

    const archivoImagen =
        document.getElementById("imagen").files[0];

    if (!archivoImagen) {

        alert("Debes seleccionar una imagen");

        return;
    }
    const {
        data: { user }
    } = await clienteSupabase.auth.getUser();

    if (!user) {

        alert("Debes iniciar sesión");

        window.location.href = "login.html";

        return;
    }
    const nombreArchivo =
        Date.now() + "-" + archivoImagen.name;
    const rutaArchivo =
        user.id + "/" + nombreArchivo;

    console.log(
        "Ruta del archivo:",
        rutaArchivo
    );
    const { error: errorImagen } =
        await clienteSupabase.storage
            .from("obras")
            .upload(
                rutaArchivo,
                archivoImagen
            );

    if (errorImagen) {

        console.error(
            "Error al subir imagen:",
            errorImagen
        );

        alert(
            "No se pudo subir la imagen: " +
            errorImagen.message
        );

        return;
    }
    const { data: datosImagen } =
        clienteSupabase.storage
            .from("obras")
            .getPublicUrl(rutaArchivo);

    const imagenUrl =
        datosImagen.publicUrl;

    console.log(
        "URL de imagen:",
        imagenUrl
    );
    const { data, error } =
        await clienteSupabase
            .from("obras")
            .insert([
                {
                    titulo: titulo,
                    autor: autor,
                    tecnica: tecnica,
                    anio: Number(anio),
                    descripcion: descripcion,
                    imagen_url: imagenUrl,
                    usuario_id: user.id
                }
            ])
            .select();

    if (error) {

        console.error(
            "Error al publicar:",
            error
        );

        alert(
            "No se pudo publicar la obra: " +
            error.message
        );

        return;
    }
    console.log(
        "Obra publicada:",
        data
    );

    alert(
        "Obra publicada correctamente"
    );

    formularioPublicar.reset();
}