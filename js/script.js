const { createApp, defineComponent, reactive, ref } = Vue;

// Datos de prueba
const server_data = {
    collection: {
        title: "Movie List",
        items: [
            {
                href: "https://en.wikipedia.org/wiki/The_Lord_of_the_Rings_(film_series)",
                data: [
                      {name : "name", value : "The Lord of the Rings", prompt : "Name"},
                  {name : "description", value : "The Lord of the Rings is a film series consisting of three high fantasy adventure films directed by Peter Jackson. They are based on the novel The Lord of the Rings by J. R. R. Tolkien. The films are subtitled The Fellowship of the Ring (2001), The Two Towers (2002) and The Return of the King (2003). They are a New Zealand-American venture produced by WingNut Films and The Saul Zaentz Company and distributed by New Line Cinema.", prompt : "Description"},
                      {name : "director", value : "Peter Jackson", prompt : "Director"},
                      {name : "datePublished", value : "2001-12-19", prompt : "Release Date"}
                ]
              },
              {
                href: "https://en.wikipedia.org/wiki/The_Hunger_Games_(film_series)",
                data: [
                      {name : "name", value : "The Hunger Games", prompt : "Name"},
                  {name : "description", value : "The Hunger Games film series consists of four science fiction dystopian adventure films based on The Hunger Games trilogy of novels, by the American author Suzanne Collins. Distributed by Lionsgate and produced by Nina Jacobson and Jon Kilik, it stars Jennifer Lawrence as Katniss Everdeen, Josh Hutcherson as Peeta Mellark, Woody Harrelson as Haymitch Abernathy, Elizabeth Banks as Effie Trinket, Philip Seymour Hoffman as Plutarch Heavensbee, Stanley Tucci as Caesar Flickerman, Donald Sutherland as President Snow, and Liam Hemsworth as Gale Hawthorne. Gary Ross directed the first film, while Francis Lawrence directed the next three films.", prompt : "Description"},
                      {name : "director", value : "Gary Ross", prompt : "Director"},
                      {name : "datePublished", value : "2012-03-12", prompt : "Release Date"}
                ]
              },
              {
                href: "https://en.wikipedia.org/wiki/Game_of_Thrones",
                data: [
                      {name : "name", value : "Game of Thrones", prompt : "Name"},
                  {name : "description", value : "Game of Thrones is an American fantasy drama television series created by David Benioff and D. B. Weiss. It is an adaptation of A Song of Ice and Fire, George R. R. Martin's series of fantasy novels, the first of which is A Game of Thrones. It is filmed in Belfast and elsewhere in the United Kingdom, Canada, Croatia, Iceland, Malta, Morocco, Spain, and the United States. The series premiered on HBO in the United States on April 17, 2011, and its seventh season ended on August 27, 2017. The series will conclude with its eighth season premiering in 2019.", prompt : "Description"},
                      {name : "director", value : "Alan Taylor et al", prompt : "Director"},
                      {name : "datePublished", value : "2011-04-17", prompt : "Release Date"}
                ]
              }
        ]
    }
};

// Componente edit-form (AHORA OCUPA TODA LA TARJETA)
const EditForm = defineComponent({
    props: {
        itemdata: Array,
        index: Number
    },
    emits: ["formClosed"],
    setup(props, { emit }) {
        const localData = reactive([...props.itemdata]);

        const closeForm = () => {
            emit("formClosed", localData);
        };

        return {
            localData,
            closeForm
        };
    },
    template: `
        <div class="card p-3 h-100 d-flex flex-column justify-content-center">
            <h4 class="mb-3">Editar Película</h4>
            <div v-for="(field, i) in localData" :key="i" class="mb-2">
                <label class="form-label">{{ field.prompt }}</label>
                <input class="form-control" v-model="field.value">
            </div>
            <button class="btn btn-primary mt-3" @click="closeForm">Guardar</button>
        </div>
    `
});

// Componente item-data (AHORA OCULTA LOS DATOS CUANDO SE EDITA)
const ItemData = defineComponent({
    props: {
        item: Object,
        index: Number
    },
    components: {
        EditForm
    },
    setup(props) {
        const showEditForm = ref(false);

        const toggleEditFormVisibility = () => {
            showEditForm.value = !showEditForm.value;
        };

        const updateItem = (updatedData) => {
            props.item.data = updatedData;
            toggleEditFormVisibility();
        };

        return {
            showEditForm,
            toggleEditFormVisibility,
            updateItem
        };
    },
    template: `
        <div class="col-lg-4 col-md-6 col-sm-12 mb-3">
            <div class="card h-100">
                <!-- MOSTRAR INFO SOLO SI NO SE ESTÁ EDITANDO -->
                <div v-if="!showEditForm" class="card-body">
                    <dl>
                        <template v-for="data in item.data" :key="data.name">
                            <dt><strong>{{ data.prompt }}</strong></dt>
                            <dd>{{ data.value }}</dd>
                        </template>
                    </dl>
                </div>

                <div v-if="!showEditForm" class="card-footer d-flex justify-content-between">
                    <a :href="item.href" class="btn btn-primary btn-sm" target="_blank">Ver</a>
                    <button class="btn btn-secondary btn-sm" @click="toggleEditFormVisibility">Editar</button>
                </div>

                <!-- MOSTRAR FORMULARIO CUANDO SE ESTÉ EDITANDO -->
                <edit-form v-if="showEditForm" :itemdata="item.data" :index="index" @formClosed="updateItem"></edit-form>
            </div>
        </div>
    `
});

// Crear la aplicación Vue
const app = createApp({
    setup() {
        const col = reactive(server_data.collection);
        return { col };
    }
});

// Registrar los componentes globalmente
app.component('edit-form', EditForm);
app.component('item-data', ItemData);

// Montar la aplicación en el elemento con id 'app'
app.mount('#app');
