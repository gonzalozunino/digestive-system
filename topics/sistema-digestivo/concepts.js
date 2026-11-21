// Organs, glands and parts of the digestive system (topic "concepts").
// `stage`: stage where questions about it appear. `role`: its function, in infinitive form.
// `similarTo`: concepts too alike to be used as wrong answers for each other.
// `categories`: e.g. "gland" (annex gland). `outsideSequence`: the food does not pass through it.
export const CONCEPTS = [
  {id:"boca", name:"la boca", stage:"boca", similarTo:"mouth", role:"Recibir el alimento, masticarlo y mezclarlo con saliva"},
  {id:"dientes", name:"los dientes", plural:true, stage:"boca", similarTo:"mouth", role:"Cortar, desgarrar y triturar los alimentos"},
  {id:"lengua", name:"la lengua", stage:"boca", similarTo:"mouth", role:"Mover el alimento, formar el bolo y sentir los sabores"},
  {id:"salivales", name:"las glándulas salivales", plural:true, stage:"boca", categories:["gland"], outsideSequence:true, role:"Producir la saliva, que ablanda el alimento y empieza a digerir el almidón"},
  {id:"faringe", name:"la faringe", stage:"esofago", role:"Conducir el bolo desde la boca hasta el esófago"},
  {id:"epiglotis", name:"la epiglotis", stage:"esofago", role:"Tapar la tráquea al tragar para que la comida no vaya a los pulmones"},
  {id:"esofago", name:"el esófago", stage:"esofago", role:"Llevar el bolo hasta el estómago con movimientos peristálticos"},
  {id:"estomago", name:"el estómago", stage:"estomago", role:"Mezclar el alimento con jugo gástrico y transformarlo en quimo"},
  {id:"delgado", name:"el intestino delgado", stage:"delgado", role:"Terminar la digestión y absorber los nutrientes hacia la sangre"},
  {id:"higado", name:"el hígado", stage:"delgado", categories:["gland"], outsideSequence:true, similarTo:"bile", role:"Producir la bilis, que ayuda a digerir las grasas"},
  {id:"vesicula", name:"la vesícula biliar", stage:"delgado", outsideSequence:true, similarTo:"bile", role:"Guardar la bilis hasta que se necesita"},
  {id:"pancreas", name:"el páncreas", stage:"delgado", categories:["gland"], outsideSequence:true, role:"Producir el jugo pancreático, que ayuda a digerir casi todos los alimentos"},
  {id:"grueso", name:"el intestino grueso", stage:"grueso", role:"Absorber el agua y formar las heces"},
  {id:"recto", name:"el recto", stage:"grueso", role:"Acumular las heces hasta que se expulsan"},
  {id:"ano", name:"el ano", stage:"grueso", role:"Expulsar las heces del cuerpo (egestión)"},
];

/** Path the food follows, in order. */
export const SEQUENCE = ["boca", "faringe", "esofago", "estomago", "delgado", "grueso", "recto", "ano"];
