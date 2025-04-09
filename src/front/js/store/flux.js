const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			auth: false,
			user: null,
			demo: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			// exampleFunction: () => {
			// 	getActions().changeColor(0, "green");
			// },

			// getMessage: async () => {
			// 	try{
			// 		// fetching data from the backend
			// 		const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
			// 		const data = await resp.json()
			// 		setStore({ message: data.message })
			// 		// don't forget to return something, that is how the async resolves
			// 		return data;
			// 	}catch(error){
			// 		console.log("Error loading message from backend", error)
			// 	}
			// },
			// changeColor: (index, color) => {
			// 	//get the store
			// 	const store = getStore();

			// 	//we have to loop the entire demo array to look for the respective index
			// 	//and change its color
			// 	const demo = store.demo.map((elm, i) => {
			// 		if (i === index) elm.background = color;
			// 		return elm;
			// 	});

			// 	//reset the global store
			// 	setStore({ demo: demo });
			// }
			registro: async (email, password) => {
				
				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"email": email,
					"password": password
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch("https://fluffy-parakeet-pjgvqj65r56x3r57w-3001.app.github.dev/api/signup", requestOptions);
					const result = await response.json();

					if (response.status === 200) {
						localStorage.setItem("token", result.access_token)
						setStore({ auth: true, user: { email } });
						return true
					}
				} catch (error) {
					console.error(error);
					return false;
				};
			},
			login: async (email, password) => {


				const myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");

				const raw = JSON.stringify({
					"email": email,
					"password": password
				});

				const requestOptions = {
					method: "POST",
					headers: myHeaders,
					body: raw,
					redirect: "follow"
				};

				try {
					const response = await fetch("https://fluffy-parakeet-pjgvqj65r56x3r57w-3001.app.github.dev/api/login", requestOptions);
					const result = await response.json();

					if (response.status === 200) {
						localStorage.setItem("token", result.access_token)
						setStore({ auth: true, user: { email } });
						return true
					}
				} catch (error) {
					console.error(error);
					return false;
				};
			},
			getProfile: async () => {
				const token = localStorage.getItem("token");
				
				if (!token) {
					console.error("No hay token disponible");
					setStore({ auth: false, user: null });
					return false;
				}
				
				try {
					const response = await fetch("https://fluffy-parakeet-pjgvqj65r56x3r57w-3001.app.github.dev/api/profile", {
						method: "GET",
						headers: {
							"Authorization": `Bearer ${token}`
						},
					});
					
					if (!response.ok) {
						const errorData = await response.json();
						console.error("Error al obtener perfil:", errorData);
						
						if (response.status === 422 || response.status === 401) {
							localStorage.removeItem("token");
							setStore({ auth: false, user: null });
						}
						return false;
					}
					
					const userData = await response.json();
					setStore({ 
						user: { 
							email: userData.email || userData.logged_in_as 
						} 
					});
					return true;
				} catch (error) {
					console.error("Error en getProfile:", error);
					return false;
				}
			},
			
			//crear un nuevo endpoint que se llame verificacion de token
			//la peticion en la funcion tokenVerify del front deberia actualizar un estado auth:
			token_verify: async () => {
                try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                        setStore({ auth: false, user: null });
                        return;
                    }

                    const response = await fetch("https://fluffy-parakeet-pjgvqj65r56x3r57w-3001.app.github.dev/api/verificacion_token", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        },
                    });

                    const data = await response.json();
                    setStore({ auth: data.auth });
                } catch (error) {
                    console.error("No se pudo verificar el token:", error);
                    setStore({ auth: false, user: null });
                }
            },
		
			logout: () => {
                localStorage.removeItem("token");
                setStore({ auth: false, user: null });
			
			},
		}
	};
};

export default getState;
