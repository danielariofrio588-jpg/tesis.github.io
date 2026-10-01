console.log("auth.js conectado");

const formularioLogin =
    document.getElementById("form-login");

const botonRegistrarse =
    document.getElementById("btn-registrarse");

const mensajeAuth =
    document.getElementById("mensaje-auth");


formularioLogin.addEventListener(
    "submit",
    iniciarSesion
);

botonRegistrarse.addEventListener(
    "click",
    registrarUsuario
);


function mostrarMensaje(texto, tipo) {

    mensajeAuth.textContent = texto;

    mensajeAuth.className =
        "mensaje-auth " + tipo;
}


async function iniciarSesion(evento) {

    evento.preventDefault();

    mostrarMensaje("", "");

    const correo =
        document
            .getElementById("correo")
            .value
            .trim();

    const contrasena =
        document
            .getElementById("contrasena")
            .value;


    if (!correo || !contrasena) {

        mostrarMensaje(
            "Completa el correo y la contraseña.",
            "error"
        );

        return;
    }


    const {
        data,
        error
    } =
        await clienteSupabase.auth
            .signInWithPassword({

                email: correo,
                password: contrasena

            });


    if (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudo iniciar sesión. Verifica tu correo y contraseña o crea una cuenta.",
            "error"
        );

        return;
    }


    console.log(
        "Usuario conectado:",
        data.user
    );


    window.location.href =
        "mis-obras.html";
}


async function registrarUsuario() {

    mostrarMensaje("", "");

    const correo =
        document
            .getElementById("correo")
            .value
            .trim();

    const contrasena =
        document
            .getElementById("contrasena")
            .value;


    if (!correo || !contrasena) {

        mostrarMensaje(
            "Escribe un correo y una contraseña.",
            "error"
        );

        return;
    }


    if (contrasena.length < 6) {

        mostrarMensaje(
            "La contraseña debe tener al menos 6 caracteres.",
            "error"
        );

        return;
    }


    const {
        data,
        error
    } =
        await clienteSupabase.auth
            .signUp({

                email: correo,
                password: contrasena

            });


    if (error) {

        console.error(error);

        mostrarMensaje(
            "No se pudo crear la cuenta. Verifica los datos ingresados.",
            "error"
        );

        return;
    }


    if (data.session) {

        mostrarMensaje(
            "Cuenta creada correctamente.",
            "exito"
        );

        setTimeout(function () {

            window.location.href =
                "mis-obras.html";

        }, 1000);

    } else {

        mostrarMensaje(
            "Cuenta creada. Revisa tu correo para confirmar tu cuenta y luego inicia sesión.",
            "exito"
        );
    }
}