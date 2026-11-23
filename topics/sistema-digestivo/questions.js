// Question bank. Each question lists the correct answer FIRST; answers are shuffled at play time.
// Optional `group` marks questions about the same topic so they are not asked twice in one game.
// Topics follow the school syllabus: función del sistema digestivo; ingestión y digestión;
// órganos, glándulas y partes con su función; recorrido del alimento.

/** Questions specific to each level (organ), keyed by level id. */
export const LEVEL_QUESTIONS = {
  boca: [
    {prompt: "¿Dónde comienza la digestión?", answers: ["En la boca","En el estómago","En el intestino delgado","En el esófago"], explanation: "En la boca los dientes trituran la comida y la saliva empieza a digerirla."},
    {group: "salivales", prompt: "¿Qué líquido se produce en la boca y ablanda la comida?", answers: ["La saliva","La bilis","El jugo gástrico","La sangre"], explanation: "Las glándulas salivales fabrican saliva: ¡más de un litro al día!"},
    {prompt: "¿Cómo se llama la mezcla de comida y saliva que tragamos?", answers: ["Bolo alimenticio","Quimo","Quilo","Heces"], explanation: "Se llama bolo alimenticio. ¡Por eso nuestro héroe se llama Bolo!"},
    {prompt: "¿Qué dientes usamos para cortar los alimentos?", answers: ["Los incisivos","Los molares","Los premolares","Las encías"], explanation: "Los incisivos son los dientes de adelante, planos y afilados como tijeras."},
    {prompt: "¿Qué dientes trituran y muelen la comida?", answers: ["Los molares","Los incisivos","Los caninos","La lengua"], explanation: "Los molares están al fondo y son anchos, perfectos para moler."},
    {group: "lengua", prompt: "¿Qué parte de la boca mueve la comida y nos deja sentir los sabores?", answers: ["La lengua","El paladar","Los labios","La úvula"], explanation: "La lengua es un músculo con papilas gustativas que detectan los sabores."},
    {prompt: "¿Cuántos dientes tiene normalmente una persona adulta?", answers: ["32","20","12","50"], explanation: "Los adultos tienen 32 dientes. Los niños tienen 20 dientes de leche."},
    {prompt: "La saliva empieza a digerir un tipo de alimento. ¿Cuál?", answers: ["Los almidones, como el pan o el arroz","Las grasas","Las vitaminas","El agua"], explanation: "La saliva tiene una enzima llamada amilasa que empieza a romper los almidones."},
  ],
  faringe: [
    {group: "cruce", prompt: "Por la faringe no solo pasa la comida. ¿Qué más pasa por ahí?", answers: ["El aire que respiramos","La sangre","La orina","La bilis"], explanation: "La faringe es un cruce: por ahí pasan la comida hacia el esófago y el aire hacia la tráquea."},
    {group: "atragantar", prompt: "¿Por qué no conviene hablar o reírse mientras tragamos?", answers: ["La comida puede irse por el camino del aire","La comida se enfría","Se nos caen los dientes","Se digiere más rápido"], explanation: "Si hablamos al tragar, la epiglotis no alcanza a tapar la tráquea y nos podemos atragantar."},
    {group: "deglucion", prompt: "¿Cómo se llama el acto de tragar la comida?", answers: ["Deglución","Masticación","Absorción","Egestión"], explanation: "Tragar se llama deglución: la lengua empuja el bolo hacia la faringe."},
    {group: "epiglotis", prompt: "¿Qué \"tapita\" evita que la comida se vaya a los pulmones al tragar?", answers: ["La epiglotis","La úvula","Las amígdalas","El diafragma"], explanation: "La epiglotis tapa la tráquea cuando tragamos. Si falla, ¡tosemos!"},
    {group: "faringe", prompt: "Al tragar, ¿por dónde pasa la comida justo antes del esófago?", answers: ["Por la faringe","Por el estómago","Por el hígado","Por el páncreas"], explanation: "La faringe (la garganta) es un cruce compartido entre la comida y el aire."},
  ],
  esofago: [
    {group: "esofago", prompt: "¿Qué tubo lleva la comida de la boca al estómago?", answers: ["El esófago","La tráquea","El intestino grueso","La vena"], explanation: "El esófago es un tubo muscular. La tráquea lleva el aire a los pulmones."},
    {group: "esofago", prompt: "¿Cómo se llaman los movimientos que empujan la comida por el esófago?", answers: ["Movimientos peristálticos","Latidos","Respiración","Masticación"], explanation: "Son contracciones en forma de ola que empujan el bolo hacia abajo."},
    {prompt: "¿Podrías tragar comida estando de cabeza?", answers: ["Sí, los músculos del esófago la empujan","No, la gravedad lo impide","Solo los líquidos","Solo si masticas mucho"], explanation: "¡Sí! Por eso los astronautas pueden comer en el espacio sin gravedad."},
    {prompt: "¿Cuánto mide más o menos el esófago de un adulto?", answers: ["Unos 25 cm","Unos 2 cm","Unos 2 metros","Unos 10 metros"], explanation: "Mide unos 25 centímetros, más o menos lo que una regla escolar larga."},
    {prompt: "¿Cuánto tarda la comida en bajar por el esófago?", answers: ["Unos pocos segundos","Una hora","Un día","Una semana"], explanation: "Solo tarda unos 5 a 10 segundos en llegar al estómago."},
    {prompt: "¿Qué hay al final del esófago para que la comida no vuelva a subir?", answers: ["Un anillo de músculo (cardias)","Un diente","Un hueso","Una vellosidad"], explanation: "El cardias es un anillo muscular que se abre para dejar pasar la comida y luego se cierra."},
  ],
  estomago: [
    {group: "estomago", prompt: "¿Qué jugo produce el estómago para digerir?", answers: ["Jugo gástrico","Saliva","Bilis","Jugo de naranja"], explanation: "El jugo gástrico contiene ácido y enzimas que deshacen la comida."},
    {group: "estomago", prompt: "¿Cómo se llama la papilla que se forma en el estómago?", answers: ["Quimo","Bolo","Quilo","Heces"], explanation: "El bolo se mezcla con el jugo gástrico y se convierte en quimo."},
    {prompt: "El jugo gástrico tiene un ácido muy fuerte. ¿Cuál es?", answers: ["Ácido clorhídrico","Ácido cítrico","Vinagre","Ácido de batería"], explanation: "El ácido clorhídrico también mata muchos microbios que vienen con la comida."},
    {prompt: "¿Por qué el estómago no se digiere a sí mismo?", answers: ["Lo protege una capa de moco","Está hecho de metal","No tiene ácido","Porque siempre está vacío"], explanation: "Una capa de moco cubre sus paredes y lo protege del ácido."},
    {prompt: "¿Qué forma tiene el estómago?", answers: ["De bolsa, parecida a una letra J","De tubo recto","De estrella","Cuadrada"], explanation: "Es una bolsa elástica en forma de J que se estira cuando comemos."},
    {prompt: "¿Cuánto tiempo se queda la comida en el estómago, aproximadamente?", answers: ["De 2 a 4 horas","5 segundos","3 días","1 minuto"], explanation: "Pasa unas horas siendo mezclada y batida, según lo que hayas comido."},
    {prompt: "¿Qué nutrientes empiezan a digerirse en el estómago?", answers: ["Las proteínas","Los azúcares","Las vitaminas","El agua"], explanation: "Una enzima del estómago, la pepsina, empieza a romper las proteínas de la carne, el huevo o la leche."},
    {prompt: "¿Qué válvula separa el estómago del intestino delgado?", answers: ["El píloro","El cardias","La epiglotis","La úvula"], explanation: "El píloro deja pasar el quimo poco a poco hacia el intestino delgado."},
  ],
  delgado: [
    {group: "delgado", prompt: "¿En qué órgano se absorben la mayoría de los nutrientes?", answers: ["En el intestino delgado","En el estómago","En la boca","En el esófago"], explanation: "En el intestino delgado los nutrientes pasan a la sangre."},
    {prompt: "¿Cuánto mide aproximadamente el intestino delgado de un adulto?", answers: ["Unos 6 o 7 metros","Unos 50 cm","Unos 100 metros","Unos 20 cm"], explanation: "¡Mide unos 6 o 7 metros! Está todo enrollado dentro de la barriga."},
    {prompt: "¿Cómo se llaman los \"deditos\" del intestino delgado que absorben nutrientes?", answers: ["Vellosidades intestinales","Papilas gustativas","Alvéolos","Neuronas"], explanation: "Millones de vellosidades aumentan la superficie para absorber más nutrientes."},
    {group: "higado", prompt: "¿Qué órgano fabrica la bilis, que ayuda a digerir las grasas?", answers: ["El hígado","El páncreas","El riñón","El corazón"], explanation: "El hígado fabrica la bilis. Es la glándula más grande del cuerpo."},
    {group: "vesicula", prompt: "¿Dónde se guarda la bilis hasta que se necesita?", answers: ["En la vesícula biliar","En la vejiga","En el estómago","En el apéndice"], explanation: "La vesícula biliar es una bolsita debajo del hígado que guarda la bilis."},
    {group: "pancreas", prompt: "¿Qué glándula produce el jugo pancreático?", answers: ["El páncreas","El hígado","La tiroides","El bazo"], explanation: "El jugo pancreático llega al intestino delgado y ayuda a digerir casi todo."},
    {prompt: "¿Cuál es la primera parte del intestino delgado?", answers: ["El duodeno","El colon","El recto","El ciego"], explanation: "El duodeno es donde llegan la bilis y el jugo pancreático."},
    {prompt: "Después de absorberse, ¿a dónde van los nutrientes?", answers: ["A la sangre","A los pulmones","Al pelo","A la saliva"], explanation: "La sangre reparte los nutrientes por todo el cuerpo para darnos energía."},
  ],
  grueso: [
    {group: "grueso", prompt: "¿Qué absorbe principalmente el intestino grueso?", answers: ["Agua","Proteínas","Grasas","Oxígeno"], explanation: "El intestino grueso recupera el agua y así las heces se vuelven más sólidas."},
    {group: "ano", prompt: "¿Por dónde salen las heces del cuerpo?", answers: ["Por el ano","Por la boca","Por el píloro","Por el duodeno"], explanation: "El ano es el final del tubo digestivo. ¡Fin del viaje!"},
    {prompt: "¿Qué seres vivos viven en el intestino grueso y nos ayudan?", answers: ["Bacterias buenas (microbiota)","Peces","Gusanos de seda","Ninguno"], explanation: "Billones de bacterias buenas nos ayudan a digerir y a fabricar algunas vitaminas."},
    {prompt: "¿Qué alimentos ayudan a que el intestino funcione bien?", answers: ["Los que tienen fibra: frutas y verduras","Las golosinas","Los refrescos","Las papas fritas"], explanation: "La fibra ayuda a que los restos avancen bien por el intestino."},
    {prompt: "¿Cómo se llaman los desechos que expulsamos?", answers: ["Heces","Quimo","Bilis","Saliva"], explanation: "Las heces son los restos que el cuerpo no pudo aprovechar."},
    {prompt: "¿Qué pequeño órgano con forma de dedo está al inicio del intestino grueso?", answers: ["El apéndice","La amígdala","La úvula","La vesícula"], explanation: "El apéndice está conectado al principio del intestino grueso."},
    {prompt: "¿Qué intestino es más largo?", answers: ["El delgado","El grueso","Miden igual","Ninguno, son del mismo tamaño que el esófago"], explanation: "¡Sorpresa! El delgado mide unos 6 m y el grueso solo 1,5 m, pero es más ancho."},
    {prompt: "¿Por qué es importante tomar agua?", answers: ["Ayuda a la digestión y evita el estreñimiento","Hace crecer el pelo","No sirve para nada","Para que el estómago flote"], explanation: "El agua ayuda a que todo avance suavemente por el tubo digestivo."},
    {group: "recto", prompt: "¿Cómo se llama la última parte del intestino grueso, donde se acumulan las heces?", answers: ["El recto","El duodeno","La faringe","El esófago"], explanation: "El recto guarda las heces hasta que vamos al baño."},
  ],
};

/** General questions: función del sistema digestivo, ingestión y digestión, procesos. */
export const GENERAL_QUESTIONS = [
  {prompt: "¿Cuál es la función principal del sistema digestivo?", answers: ["Transformar los alimentos en nutrientes que el cuerpo puede usar","Llevar oxígeno a la sangre","Producir la orina","Mover los huesos"], explanation: "El sistema digestivo transforma los alimentos en nutrientes, los absorbe y expulsa lo que no sirve."},
  {prompt: "¿Para qué necesita el cuerpo los nutrientes de los alimentos?", answers: ["Para tener energía, crecer y reparar el cuerpo","Solo para tener sed","Para respirar mejor","No los necesita"], explanation: "Los nutrientes nos dan energía y los materiales para crecer y reparar el cuerpo."},
  {prompt: "¿Qué hace el sistema digestivo con lo que el cuerpo no puede aprovechar?", answers: ["Lo expulsa como heces","Lo guarda para siempre","Lo convierte en sangre","Lo manda a los pulmones"], explanation: "Lo que no se digiere ni se absorbe forma las heces, que se expulsan por el ano."},
  {prompt: "¿Qué sistema reparte por el cuerpo los nutrientes que absorbe el sistema digestivo?", answers: ["El sistema circulatorio (la sangre)","El sistema óseo","El sistema muscular","El sistema digestivo solo"], explanation: "Los nutrientes pasan a la sangre y el sistema circulatorio los lleva a todas las células."},
  {prompt: "¿Qué son los nutrientes?", answers: ["Sustancias pequeñas de los alimentos que el cuerpo absorbe y usa","Los restos que salen como heces","Un tipo de diente","Los jugos del estómago"], explanation: "La digestión rompe los alimentos en nutrientes tan pequeños que pueden pasar a la sangre."},
  {prompt: "¿Qué es la ingestión?", answers: ["Incorporar los alimentos por la boca","Transformar los alimentos en nutrientes","Expulsar las heces","Pasar los nutrientes a la sangre"], explanation: "Ingestión es el ingreso del alimento al cuerpo por la boca."},
  {prompt: "¿Qué es la digestión?", answers: ["Transformar los alimentos en sustancias más simples: los nutrientes","Meter el alimento en la boca","Expulsar los desechos","Respirar mientras comemos"], explanation: "La digestión transforma los alimentos en nutrientes, de forma mecánica y química."},
  {prompt: "¿En qué se diferencian la ingestión y la digestión?", answers: ["La ingestión es incorporar el alimento; la digestión es transformarlo en nutrientes","Son exactamente lo mismo","La digestión ocurre antes que la ingestión","La ingestión ocurre en el intestino"], explanation: "Primero ingerimos (entra el alimento por la boca) y después lo digerimos (lo transformamos)."},
  {prompt: "Llevarte una cucharada de sopa a la boca es un ejemplo de…", answers: ["Ingestión","Digestión química","Absorción","Egestión"], explanation: "Incorporar el alimento por la boca es la ingestión."},
  {prompt: "Cuando el jugo gástrico deshace las proteínas, ¿qué proceso ocurre?", answers: ["Digestión química","Ingestión","Egestión","Digestión mecánica"], explanation: "Es digestión química: los jugos digestivos cambian los alimentos en sustancias más simples."},
  {prompt: "Masticar la comida con los dientes es un ejemplo de…", answers: ["Digestión mecánica","Digestión química","Absorción","Egestión"], explanation: "Es digestión mecánica: se rompe el alimento en trozos más pequeños, sin cambiar qué sustancia es."},
  {prompt: "¿Qué diferencia hay entre digestión mecánica y digestión química?", answers: ["La mecánica rompe en trozos; la química transforma con jugos digestivos","Son lo mismo","La mecánica ocurre solo en el ano","La química se hace con los dientes"], explanation: "Mecánica: dientes y músculos trituran y mezclan. Química: saliva, jugo gástrico, bilis y jugo pancreático transforman."},
  {prompt: "Los movimientos del estómago que mezclan y aplastan la comida son digestión…", answers: ["Mecánica","Química","Ingestión","Absorción"], explanation: "Mezclar y aplastar con músculos es digestión mecánica."},
  {prompt: "¿Cuál de estos procesos ocurre primero?", answers: ["La ingestión","La digestión","La absorción","La egestión"], explanation: "Primero el alimento entra por la boca (ingestión); después se digiere, se absorbe y se expulsa lo que sobra."},
  {prompt: "¿Cómo se llama el paso de los nutrientes del intestino a la sangre?", answers: ["Absorción","Ingestión","Egestión","Masticación"], explanation: "La absorción ocurre sobre todo en el intestino delgado, a través de las vellosidades."},
  {prompt: "¿Cómo se llama la expulsión de las heces por el ano?", answers: ["Egestión","Ingestión","Absorción","Digestión"], explanation: "La egestión (o defecación) es la salida de los desechos del cuerpo."},
  {prompt: "¿Cuál es el orden correcto de los procesos?", answers: ["Ingestión → digestión → absorción → egestión","Digestión → ingestión → egestión → absorción","Absorción → ingestión → digestión → egestión","Egestión → absorción → digestión → ingestión"], explanation: "Entra el alimento, se transforma, los nutrientes pasan a la sangre y lo que sobra se expulsa."},
  {prompt: "¿En qué parte del cuerpo ocurre la ingestión?", answers: ["En la boca","En el estómago","En el intestino grueso","En el hígado"], explanation: "La ingestión ocurre en la boca, la puerta de entrada del sistema digestivo."},
  {prompt: "¿Qué parte de lo que comemos termina formando las heces?", answers: ["Lo que el cuerpo no pudo digerir ni absorber","Los nutrientes","Solo el agua","La saliva"], explanation: "Las heces son los restos que no se aprovechan, como parte de la fibra."},
];
