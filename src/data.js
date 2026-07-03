// Los 18 momentos de nuestro camino, en orden cronológico.
// img: nombre del archivo en /public/assets (01.jpg ... 18.jpg)
export const STOPS = [
  { img: '01', date: '19 de agosto, 2025', title: 'Donde empezó todo', msg: 'Aquí empezó nuestra historia. Entre luces y música te vi, y algo dentro de mí supo que ibas a ser tú. Si hoy me extrañas, acuérdate: desde este primer día nunca me fui del todo.' },
  { img: '02', date: '14 de septiembre, 2025', title: 'Nuestras noches tranquilas', msg: 'Abrazados bajo la cobija, sin apuro y sin ruido. Mi lugar favorito del mundo no es un lugar: eres tú. Cierra los ojos y siente que sigo ahí, cuidándote.' },
  { img: '03', date: '1 de octubre, 2025', title: 'Kilómetros a tu lado', msg: 'No importaba a dónde íbamos: contigo hasta el viaje más corto se hacía lindo. Todos los caminos, tarde o temprano, me traen de vuelta a ti.' },
  { img: '04', date: '12 de octubre, 2025', title: 'Nuestro reflejo', msg: 'Otro ascensor, otra foto, la misma sonrisa tuya que me derrite. Aunque hoy el espejo te muestre sola, yo te sigo mirando desde aquí.' },
  { img: '05', date: '27 de octubre, 2025', title: 'Como dos niños', msg: 'Te cargué en la espalda y nos reímos como niños. Contigo todo es más liviano. Si me extrañas, ríete de una bobería: seguro yo me estaría riendo contigo.' },
  { img: '06', date: '4 de diciembre, 2025', title: 'Listos para salir', msg: 'Arreglados, perfumados y felices de tenernos. Me encanta ser tu compañía. Guárdame el próximo lugar a tu lado, que ya vuelvo a buscarte.' },
  { img: '07', date: '16 de diciembre, 2025', title: 'El mar en Panamá', msg: 'El agua, las montañas verdes y tú abrazándome. Cuando me extrañes, mira el mar: la misma agua que nos abrazó ahí me lleva de vuelta a tus brazos.' },
  { img: '08', date: '19 de diciembre, 2025', title: 'El Garín', msg: 'Maletas, lentes de sol y una sonrisa enorme: arrancaba el Garín. Ese viaje juntos no lo olvido nunca. Ahora me toca viajar a mí, pero mi destino siempre eres tú.' },
  { img: '09', date: '25 de diciembre, 2025', title: 'El desierto, juntos', msg: 'En medio del desierto, montados en los camellos, muertos de risa. La distancia de hoy es solo otro desierto: lo cruzo entero con tal de llegar a ti.' },
  { img: '10', date: '26 de diciembre, 2025', title: 'En Masada', msg: 'Allá arriba, con todo ese paisaje enorme, lo único que me importaba eras tú. Frente a lo más grande del mundo, te elegí a ti. Y te sigo eligiendo.' },
  { img: '11', date: '4 de enero, 2026', title: 'En el Kotel', msg: 'Frente al Kotel pedí por nosotros. Donde sea que estés, mis oraciones te acompañan. No estás sola: estás pensada, cuidada y amada por mí.' },
  { img: '12', date: '5 de marzo, 2026', title: 'Bien elegantes', msg: 'Tú de vestido, yo de saco, y yo sintiéndome el más afortunado del salón. Guárdame siempre el brazo: es tuyo, aunque hoy esté lejos.' },
  { img: '13', date: '22 de marzo, 2026', title: 'Nuestro sofá', msg: 'En casa, sin más plan que estar juntos. Esos son los momentos que más extraño. Déjame un espacio ahí: apenas pueda, vuelvo a recostar la cabeza cerca de ti.' },
  { img: '14', date: '5 de abril, 2026', title: 'Sol, agua y tú', msg: 'Agua turquesa, sol en la piel y tu risa tapando todo lo demás. Cuando me extrañes, busca el sol: te está dando el mismo abrazo que yo te daría.' },
  { img: '15', date: '8 de mayo, 2026', title: 'La ciudad abajo', msg: 'La ciudad entera atrás, y tú adelante, que eres mi lugar favorito para mirar. No importa cuánto me aleje: siempre estás en primer plano.' },
  { img: '16', date: '10 de mayo, 2026', title: 'Cena con luces', msg: 'Cena, luces de ciudad y esa complicidad que no necesita palabras. Aunque hoy cene lejos, brindo por ti en silencio. Te tengo guardada la próxima cena.' },
  { img: '17', date: '26 de junio, 2026', title: 'Nuestra noche especial', msg: 'Bien vestidos, entre flores blancas, brillando como lo que somos. Eres mi compañía para todas las noches lindas que vienen.' },
  { img: '18', date: '28 de junio, 2026', title: 'Hasta hoy… y lo que falta', msg: 'De aquel primer día hasta hoy, mira todo lo que hemos caminado juntos. Cada foto es mi forma de decirte que ya te estoy extrañando de vuelta a casa. Te amo. 💙' },
]

// Geometría del camino (unidades de escena)
export const SPACING = 15
export const SIDE_X = 5.6
export const PHOTO_Y = 2.5

// Tiempo de lectura por parada (segundos que el mensaje queda fijo, además del viaje)
export function readTime(msg) {
  return Math.min(9.5, Math.max(5, msg.length / 15 + 3))
}
