console.log("auth.js conectado");
const formularioLogin =
    document.getElementById(
        "form-login"
    );

const botonRegistrarse =
    document.getElementById(
        "btn-registrarse"
    );

formularioLogin.addEventListener(
    "submit",
    iniciarSesion
);

botonRegistrarse.addEventListener(
    "click",
    registrarUsuario
);

async function iniciarSesion(evento) {

    evento.preventDefault();

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

        alert(
            "Completa el correo y la contraseña"
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

        alert(
            "Correo o contraseña incorrectos"
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

        alert("Escribe un correo y una contraseña");

        return;
    }

    if (contrasena.length < 6) {

        alert("La contraseña debe tener al menos 6 caracteres");

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

        alert(
            "No se pudo crear la cuenta: " +
            error.message
        );
        return;
    }
    if (data.session) {

        alert("Cuenta creada correctamente" );
        window.location.href =
            "mis-obras.html";
    } else {
        alert("Cuenta creada. Revisa tu correo para confirmar tu cuenta y luego inicia sesión.");
    }
}