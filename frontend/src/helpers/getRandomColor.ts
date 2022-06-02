interface IgetRandomColor {
  (): string;
};

export const getRandomColor: IgetRandomColor = () => 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
