export interface Exercise {
  id: string;
  type: 'single' | 'multiple';
  question: string;
  options: string[];
  answer: number[] | number;
  explanation: string;
}

export const exercises: Exercise[] = [
  {
    id: '1',
    type: 'single',
    question: '在图像分类任务中，若模型将大量负样本误判为正样本，这表明什么？',
    options: ['Accuracy 偏高', 'Precision 偏高', 'Recall 偏低', 'Precision 偏低'],
    answer: 3,
    explanation: 'Precision (精确率) = TP / (TP + FP)。将大量负样本误判为正样本，意味着 FP (假正例) 数量很高，因此 Precision 会偏低。',
  },
  {
    id: '2',
    type: 'single',
    question: '在 R^2 中，下列集合是子空间的有',
    options: ['{(x,y)|y=0}', '{(x,y)|y=0}（与 A 等价）', '{(x,y)|x+y=1}', '{(x,y)|x+1=2y}'],
    answer: 0,
    explanation: '子空间需要满足对加法和数乘封闭，并且包含零向量。只有选项 A 满足所有条件：1. (0,0) 在集合中。 2. 若 (x1, 0) 和 (x2, 0) 在集合中，其和 (x1+x2, 0) 也在。 3. 若 (x, 0) 在集合中，其数乘 (kx, 0) 也在。',
  },
  {
    id: '3',
    type: 'single',
    question: '神经网络中，反向传播用于？',
    options: ['计算损失函数', '更新网络权重', '前向传播', '激活函数'],
    answer: 1,
    explanation: '反向传播算法（Backpropagation）通过计算损失函数对网络权重的梯度，来指导如何更新权重以减小损失，是训练神经网络的核心算法。',
  },
  {
    id: '4',
    type: 'multiple',
    question: '以下哪些是 React 的特点？',
    options: ['虚拟DOM', '组件化', '单向数据流', '双向数据绑定'],
    answer: [0, 1, 2],
    explanation: 'React 使用虚拟DOM来提高性能，推崇组件化开发，并采用单向数据流。双向数据绑定是 Angular 和 Vue 的特点。',
  },
  {
    id: '5',
    type: 'single',
    question: '哪个 CSS 属性可以实现 Flex 布局？',
    options: ['display: grid;', 'display: flex;', 'display: inline-block;', 'position: absolute;'],
    answer: 1,
    explanation: '`display: flex;` 用于声明一个 flex 容器，使其子元素成为 flex 项，从而应用 flex 布局。',
  },
  {
    id: '6',
    type: 'multiple',
    question: '关于 JavaScript 中的 `let` 和 `const`，以下说法正确的有？',
    options: [
      '`let` 声明的变量可以被重新赋值',
      '`const` 声明的变量不能被重新赋值',
      '它们都具有块级作用域',
      '`const` 声明的数组或对象，其内容也不可更改',
    ],
    answer: [0, 1, 2],
    explanation: '`let` 和 `const` 都是块级作用域。`let` 允许重新赋值，而 `const` 不允许。但 `const` 声明的如果是对象或数组，其内部的属性或元素是可以被修改的，只是变量本身不能指向另一个引用。',
  },
];
