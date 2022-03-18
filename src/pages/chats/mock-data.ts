export interface MessageModel {
  text: string;
  date: Date;
  isSentMessage: boolean;
  classForRoot?: string;
}

export const messagesData: MessageModel[] = [
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
