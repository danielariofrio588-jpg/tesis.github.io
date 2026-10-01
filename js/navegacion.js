async function actualizarNavegacion() {

    const zonaUsuario =
        document.getElementById("zona-usuario");

    if (!zonaUsuario) {
        return;
    }
    const {
        data: { user }
    } =
        await clienteSupabase.auth.getUser();
    if (user) {
        zonaUsuario.innerHTML = `
            <a href="publicar.html">Publicar obra </a>

            <a href="mis-obras.html"> Mis obras</a>

            <button type="button" id="btn-cerrar-sesion">Cerrar sesión </button>

        `;
        const botonCerrar =
            document.getElementById("btn-cerrar-sesion");



        botonCerrar.addEventListener("click",cerrarSesion );

    } else {

        zonaUsuario.innerHTML = `

            <a href="login.html">Iniciar sesión</a>

        `;
    }
}

async function cerrarSesion() {

    const { error } =
        await clienteSupabase.auth.signOut();
    if (error) {

        console.error("Error al cerrar sesión:", error );
        alert("No se pudo cerrar la sesión");

        return;
    }
    window.location.href =
        "index.html";
}
actualizarNavegacion();