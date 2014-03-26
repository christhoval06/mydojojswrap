require([ "modulos/layout", "modulos/menu", "app/modulos", "app/login" ],
		function(layout, menu, modulos, login) {

			rutas = function() {
				login.rutas(createLayout);
			};

			createLayout = function() {
				layout.init(null, false, function() {
					layout.create({
						id : layout.top(),
						region : 'top',
						splitter : false
					}, function() {
						dojo.create("div", {
							id : "menu_container"
						}, layout.top());
						dojo.create("div", {
							id : "rutas_formulario"
						}, layout.top());

						login.rutasForm();
					});
					menu.create('app/menu.json', "menu_container", function() {
						/* iniciando modulos de la aplicacion */
						modulos.init();
						/* creando el layout del app */
						layout.create({
							id : layout.center(),
							region : 'center',
							splitter : true,
							executeScripts : true,
							scriptHasHooks : true
						}, function() {
							dojo.create("div", {
								id : "_menusecundario_",
								class : "menusecundario"
							}, layout.center() || dojo.body());

							dojo.create("div", {
								id : "_app_"
							}, layout.center() || dojo.body());
						});
						layout.create({
							id : layout.foot(),
							region : 'bottom',
							splitter : false,
							style : 'text-align: center; border: none;'
						}, function() {
							dojo.create("div", {
								id : "usuario"
							}, layout.foot());
							dojo.create("div",
									{
										class : "usuario",
										innerHTML : dojo.query(dojo.body())
												.data()[0].usuario
												|| ""
									}, "usuario");
						});
						/* destruyendo el loader */
						dojo.destroy("genLoader");
						/* iniciando el enrutador */
						rutas();

					});
				});
			};

			login.login(createLayout);

		});
