describe('Suite de Pruebas - Creación de Solicitudes', () => {

  // Asumimos que antes de cada prueba inicias sesión.
  beforeEach(() => {
    // Aquí puedes invocar un comando personalizado de login, por ejemplo:
    cy.login('yrios', 'yazmin1997'); 
    cy.visit('https://fabrica2023.estrategiasegura.biz/Solicitudes/Index'); // Empezamos desde el home/dashboard
  });

  it('CP01 - Debería crear una nueva solicitud diligenciando los campos obligatorios', () => {
    
    // =========================================================
    // PASO 1: NAVEGACIÓN EN EL MENÚ
    // =========================================================
    // Clic en el menú desplegable "Solicitudes" y luego en "Nueva Solicitud"
    cy.contains('a', 'Solicitudes').click();
    cy.contains('a', 'Nueva Solicitud').click();


    // =========================================================
    // PASO 2: VALIDAR DOCUMENTO DEL USUARIO
    // =========================================================
    cy.get('#Codigo').type('170220261');
    cy.get('#btnValidarUsuario').click();

    // El botón de 'Crear Solicitud' aparece tras una llamada asíncrona.
    // Le decimos a Cypress que espere hasta que sea visible y no esté deshabilitado.
    cy.get('#Submit', { timeout: 10000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click();


    // =========================================================
    // PASO 3: DILIGENCIAR EL FORMULARIO COMPLEMENTARIO
    // =========================================================
    
// 3.1. Campo Kendo UI (Ciudad) - Modo Fuerza Bruta
    
    // Abrimos el menú desplegable
    cy.get('span[aria-owns="Solicitud_Ciudad_listbox"]').click(); 

    // Buscamos Medellín y forzamos el clic aunque esté fuera del área visible
    cy.contains('li.k-item', 'MEDELLIN, ANTIOQUIA').click({ force: true });

    // 3.2. Prioridad
    cy.get('#Prioridad').select('3'); // Selecciona "Alta"

    // 3.3. Interceptar petición de Productos/Destinos
    // Al elegir una Línea, el sistema va al backend a buscar los Destinos. 
    // Le avisamos a Cypress que vigile esa petición de red.
    cy.intercept('GET', '**/Solicitud/ObtenerDestinos*').as('cargarDestinos');
    
    // Seleccionamos Línea (Ej. 4 = Crédito de Consumo)
    cy.get('#Producto').select('4'); 
    
    // Esperamos a que la petición termine para que el campo "Destino" se llene
    cy.wait('@cargarDestinos');

    // 3.4. Interceptar petición de parámetros de destino
    cy.intercept('GET', '**/Solicitud/ObtenerParametrosDestino*').as('parametrosDestino');
    
    // Seleccionamos la segunda opción del select "Destino" dinámicamente
    cy.get('#Destino').find('option').eq(1).then((opt) => {
      cy.get('#Destino').select(opt.val());
    });
    cy.wait('@parametrosDestino'); // Esperamos a que traiga los rangos de plazo/monto

    // 3.5. Plazo y Monto
    // Usamos .blur() para simular que el usuario hace clic fuera del campo.
    // Esto es vital porque tu código ejecuta validaciones en el evento "focusout" o "blur".
    cy.get('#Plazo').type('12').blur();
    cy.get('#Monto').type('5000000').blur();

    // 3.6. Forma de pago y periodicidad (Se habilitan luego del blur anterior)
    cy.get('#FormaPago').select('1'); // Taquilla
    cy.get('#Periodicidad').select('2'); // Mensual

    // 3.7. Autorización Tratamiento de datos (Radio button)
    // Usamos { force: true } por si el framework CSS (Inspinia/iCheck) oculta el radio nativo.
    cy.get('#AutorizaTratamientoDato1').check({ force: true }); 

    // 3.8. Origen y Oficina
    cy.get('#IdOrigen').select('1'); // Gestión Comercial
    cy.get('#Agencia').select('1'); // Agencia Medellin


    // =========================================================
    // PASO 4: FIRMA EN CANVAS Y ENVÍO
    // =========================================================
    // Para firmar en un Canvas interactivo, simulamos clics en coordenadas XY
    cy.get('.pad').click(50, 50).click(100, 100).click(150, 50);

    // Clic al botón final para enviar el formulario
    // Buscamos el botón dentro del div de guardado
    cy.get('#div_Botones').contains('button', 'Crear Solicitud').click();

    // =========================================================
    // PASO 5: ASERCIÓN / VALIDACIÓN FINAL
    // =========================================================
    // Aquí validamos que el sistema haga lo esperado al guardar. 
    // Por ejemplo, que salga una alerta verde de éxito:
    // cy.get('.sweet-alert').should('contain', 'Guardado exitosamente');
    
    // O validar que redirige a mis solicitudes:
    // cy.url().should('include', '/Solicitudes/MisSolicitudes');
  });
});