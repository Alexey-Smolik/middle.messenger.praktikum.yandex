export interface ChatModel {
  id: number;
  name: string;
  msg: string;
  time: string;
  count?: string
  isSentMessage?: boolean;
  classForRoot?: string;
}

export interface MessageModel {
  text: string;
  date: Date;
  isSentMessage: boolean;
  classForRoot?: string;
}

export const chats: ChatModel[] = [
  {
    id: 0,
    name: 'Андрей',
    msg: 'Изображение',
    time: '10:49',
    count: '2',
    classForRoot: 'chat-section'
  },
  {
    id: 1,
    name: 'Очень длинное название чата',
    msg: 'cтикер',
    time: '12:00',
    isSentMessage: true,
    classForRoot: 'chat-section'
  },
  {
    id: 2,
    name: 'Илья',
    msg: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
    time: '15:12',
    count: '4',
    classForRoot: 'chat-section'
  },
  {
    id: 3,
    name: 'Вадим',
    msg: 'Круто!',
    time: 'Пт',
    isSentMessage: true,
    count: '22',
    classForRoot: 'chat-section'
  },
  {
    id: 4,
    name: 'тет-а-теты',
    msg: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing',
    time: 'Ср',
    isSentMessage: true,
    count: '100',
    classForRoot: 'chat-section'
  },
  {
    id: 5,
    name: '1,2,3',
    msg: 'Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    time: 'Пн',
    classForRoot: 'chat-section'
  },
  {
    id: 6,
    name: 'Design Destroyer',
    msg: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
    time: 'Пн',
    classForRoot: 'chat-section'
  },
  {
    id: 7,
    name: 'Day.',
    msg: 'Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur',
    time: '1 мая 2020',
    classForRoot: 'chat-section'
  },
  {
    id: 8,
    name: 'Стас Рогозин',
    msg: 'Можно или сегодня или завтра',
    time: '12 апреля 2020',
    classForRoot: 'chat-section'
  },
  {
    id: 9,
    name: 'Стас Рогозин',
    msg: 'Можно или сегодня или завтра',
    time: '12 апреля 2020',
    classForRoot: 'chat-section'
  },
  {
    id: 10,
    name: 'Стас Рогозин',
    msg: 'Можно или сегодня или завтра',
    time: '12 апреля 2020',
    classForRoot: 'chat-section'
  },
  {
    id: 11,
    name: 'Стас Рогозин',
    msg: 'Можно или сегодня или завтра',
    time: '12 апреля 2020',
    classForRoot: 'chat-section'
  },
  {
    id: 12,
    name: 'Стас Рогозин',
    msg: 'Можно или сегодня или завтра',
    time: '12 апреля 2020',
    classForRoot: 'chat-section'
  },
  {
    id: 13,
    name: 'Стас Рогозин',
    msg: 'Можно или сегодня или завтра',
    time: '12 апреля 2020',
    classForRoot: 'chat-section'
  },
  {
    id: 14,
    name: 'Стас Рогозин',
    msg: 'Можно или сегодня или завтра',
    time: '12 апреля 2020',
    classForRoot: 'chat-section'
  },
];

export const messages: MessageModel[] = [
  {
    text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    date: (new Date(2021, 5, 12, 8, 30)),
    isSentMessage: true,
    classForRoot: 'sent-message-wrapper'
  },
  {
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, content here\', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    date: new Date(2021, 5, 12, 8, 31),
    isSentMessage: false,
    classForRoot: 'received-message-wrapper'
  },
  {
    text: 'The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.',
    date: new Date(2021, 5, 12, 8, 32),
    isSentMessage: true,
    classForRoot: 'sent-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 33),
    isSentMessage: true,
    classForRoot: 'sent-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 34),
    isSentMessage: true,
    classForRoot: 'sent-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 35),
    isSentMessage: false,
    classForRoot: 'received-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 36),
    isSentMessage: true,
    classForRoot: 'sent-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 37),
    isSentMessage: false,
    classForRoot: 'received-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 38),
    isSentMessage: false,
    classForRoot: 'received-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 39),
    isSentMessage: false,
    classForRoot: 'received-message-wrapper'
  },
  {
    text: 'сообщение 1',
    date: new Date(2021, 5, 12, 8, 48),
    isSentMessage: true,
    classForRoot: 'sent-message-wrapper'
  },
  {
    text: 'сообщение 2',
    date: new Date(2021, 5, 12, 0, 15),
    isSentMessage: false,
    classForRoot: 'received-message-wrapper'
  },
  {
    text: 'сообщение 3',
    date: new Date(2021, 8, 24, 15, 23),
    isSentMessage: true,
    classForRoot: 'sent-message-wrapper'
  }
];
