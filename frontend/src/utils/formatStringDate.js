export function stringToDate (datetime_string) {
  var d = datetime_string.split('T');
  var date = [];
  var time = [];
  var result = {};

  if (d.length < 2) { 
    d = datetime_string.split(' ');

    if (d.length < 2) { 
      return datetime_string;
    }
  }

  date = d[0].split('-');
  time = d[1].split(':');

  if (date.length < 3) { return datetime_string; }
  if (time.length < 3) { return datetime_string; }

  result = new Date(
    parseInt(date[0], 10),
    parseInt(date[1], 10)-1,
    parseInt(date[2], 10),
    parseInt(time[0], 10),
    parseInt(time[1], 10),
    parseInt(time[2], 10)
  );

  if (result.toString() === 'Invalid Date') { return datetime_string; }

  return result;
}

export function formatDate(datetime_string, show_moth=true, show_year=true) {
  var result = stringToDate(datetime_string);
  var days_names = [
   'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];
  var months_names = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'setiembre', 'octubre', 'noviembre',
    'diciembre'
  ];
  var r = '';

  if (result.toString() === 'Invalid Date') { return datetime_string; }

  result.date = result.getDate();
  result.month = result.getMonth();
  result.year = result.getFullYear();

  r += days_names[result.getDay()] + ' ' + 
    ((result.date < 10)? '0' : '') + result.date
    ;

  if (show_moth) {
    r += ' de ' + months_names[result.month];
  }

  if (show_year) {
    r += ' de ' + result.year;
  }

  return r;
}

export function formatDateTime(datetime_string) {
  var result = stringToDate(datetime_string);
  var ampm = 'AM';

  if (result.toString() === 'Invalid Date') { return datetime_string; }

  result.hours = result.getHours();
  result.min = result.getMinutes().toString().padStart(2, '0');

  if (result.hours >= 12) {
    ampm = 'PM';
  }

  if (result.hours < 13) {
    return result.hours + ':' + result.min + ' ' + ampm;
  }

  return (result.hours - 12) + ':' + result.min + ' ' + ampm;
}
