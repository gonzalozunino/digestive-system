// Organs, glands and parts of the digestive system.
// `level` is the level where questions about the part appear; `role` is its function (infinitive form).
// `similarTo` groups parts whose roles are too alike to be used as wrong answers for each other.
// `gland` = annex gland; `annex` = annex organ the food does not pass through.
export const PARTS = [
  {id:"boca", name:"la boca", level:"boca", similarTo:"mouth", role:"Recibir el alimento, masticarlo y mezclarlo con saliva"},
  {id:"dientes", name:"los dientes", plural:true, level:"boca", similarTo:"mouth", role:"Cortar, desgarrar y triturar los alimentos"},
  {id:"lengua", name:"la lengua", level:"boca", similarTo:"mouth", role:"Mover el alimento, formar el bolo y sentir los sabores"},
  {id:"salivales", name:"las glándulas salivales", plural:true, level:"boca", gland:true, role:"Producir la saliva, que ablanda el alimento y empieza a digerir el almidón"},
  {id:"faringe", name:"la faringe", level:"esofago", role:"Conducir el bolo desde la boca hasta el esófago"},
  {id:"epiglotis", name:"la epiglotis", level:"esofago", role:"Tapar la tráquea al tragar para que la comida no vaya a los pulmones"},
  {id:"esofago", name:"el esófago", level:"esofago", role:"Llevar el bolo hasta el estómago con movimientos peristálticos"},
  {id:"estomago", name:"el estómago", level:"estomago", role:"Mezclar el alimento con jugo gástrico y transformarlo en quimo"},
  {id:"delgado", name:"el intestino delgado", level:"delgado", role:"Terminar la digestión y absorber los nutrientes hacia la sangre"},
  {id:"higado", name:"el hígado", level:"delgado", gland:true, similarTo:"bile", role:"Producir la bilis, que ayuda a digerir las grasas"},
  {id:"vesicula", name:"la vesícula biliar", level:"delgado", annex:true, similarTo:"bile", role:"Guardar la bilis hasta que se necesita"},
  {id:"pancreas", name:"el páncreas", level:"delgado", gland:true, role:"Producir el jugo pancreático, que ayuda a digerir casi todos los alimentos"},
  {id:"grueso", name:"el intestino grueso", level:"grueso", role:"Absorber el agua y formar las heces"},
  {id:"recto", name:"el recto", level:"grueso", role:"Acumular las heces hasta que se expulsan"},
  {id:"ano", name:"el ano", level:"grueso", role:"Expulsar las heces del cuerpo (egestión)"},
];

/** Path the food follows, in order. */
export const ROUTE = ["boca", "faringe", "esofago", "estomago", "delgado", "grueso", "recto", "ano"];
