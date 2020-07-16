function formatFileSize(size) {
  const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const threshold = 1024;
  size = Number(size) * threshold;
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));
  return `${(size / Math.pow(threshold, i)).toFixed(2) * 1} ${units[i]}`;
}

export default {
  _default: () => `Este campo no es válido.`,
  after: (field, [target, inclusion]) => `Este campo debe ser posterior ${inclusion ? 'o igual ' : ''}a ${target}.`,
  alpha: () => `Este campo solo debe contener letras.`,
  alpha_dash: () => `Este campo solo debe contener letras, números y guiones.`,
  alpha_num: () => `Este campo solo debe contener letras y números.`,
  alpha_spaces: () => `Este campo solo debe contener letras y espacios.`,
  before: (field, [target, inclusion]) => `Este campo debe ser anterior ${inclusion ? 'o igual ' : ''}a ${target}.`,
  between: (field, [min, max]) => `Este campo debe estar entre ${min} y ${max}.`,
  confirmed: () => `Este campo no coincide.`,
  credit_card: () => `Este campo es inválido.`,
  date_between: (field, [min, max]) => `Este campo debe estar entre ${min} y ${max}.`,
  date_format: (field, [format]) => `Este campo debe tener un formato ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Este campo debe ser numérico y contener${decimals === '*' ? '' : ' ' + decimals} puntos decimales.`,
  digits: (field, [length]) => `Este campo debe ser numérico y contener exactamente ${length} dígitos.`,
  dimensions: (field, [width, height]) => `Este campo debe ser de ${width} píxeles por ${height} píxeles.`,
  email: () => `Este campo debe ser un correo electrónico válido.`,
  excluded: () => `Este campo debe ser un valor válido.`,
  ext: () => `Este campo debe ser un archivo válido.`,
  image: () => `Este campo debe ser una imagen.`,
  included: () => `Este campo debe ser un valor válido.`,
  integer: () => `Este campo debe ser un entero.`,
  ip: () => `Este campo debe ser una dirección ip válida.`,
  length: (field, [length, max]) => {
    if (max) {
      return `El largo de este campo debe estar entre ${length} y ${max}.`;
    }

    return `El largo de este campo debe ser ${length}.`;
  },
  max: (field, [length]) => `Este campo no debe ser mayor a ${length} caracteres.`,
  max_value: (field, [max]) => `Este campo debe de ser ${max} o menor.`,
  mimes: () => `Este campo debe ser un tipo de archivo válido.`,
  min: (field, [length]) => `Este campo debe tener al menos ${length} caracteres.`,
  min_value: (field, [min]) => `Este campo debe ser ${min} o superior.`,
  numeric: () => `Este campo debe contener solo caracteres numéricos.`,
  regex: () => `El formato de este campo no es válido.`,
  required: () => `Este campo es obligatorio.`,
  size: (field, [size]) => `Este campo debe ser menor a ${formatFileSize(size)}.`,
  url: () => `Este campo no es una URL válida.`
}
