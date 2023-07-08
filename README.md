API REST para CRUD de usuarios en mongoDb

La "ruta_base" siempre es "http://localhost/users/" (reemplazar localhost si se sube a un dominio)

1. Metodo GET a ruta_base con query params

        Filtros posibles --> Sin query params trae todos
                 --> ?nombre = "x"  => trae todos los que nombre = x
                 --> ?apellido = "x"  => trae todos los que apellido = x
                 --> ?dni = "x"  => trae todos los que dni = x
                 --> ?edad_mayor_que = "x"  => trae todos los que edad > x

2. Metodo GET a ruta_base/:id

        traer usuario por id

3. Metodo POST a ruta_base/

        crear un nuevo usuario

        parameros requeridos ( nombre, apellido, email, dni) en request.body

        parametros opcionales (edad, altura, peso, sueldo)

3. Metodo POST a ruta_base/

        crear un nuevo usuario

        parameros requeridos ( nombre, apellido, email, dni) en request.body

4. Metodo PUT a ruta_base/:id

        modificar un nuevo usuario por id

        parameros requeridos ( nombre, apellido, email, dni) en request.body

        parametros opcionales (edad, altura, peso, sueldo)

5. Metodo DELETE a ruta_base/:id

        eliminar un usuario por id

