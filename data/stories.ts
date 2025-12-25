import { Story } from '../types';

export const STORIES: Story[] = [
    {
        id: '1',
        title: 'At the Park',
        emoji: '🌳',
        text: [
            'Amir and Sami are at the park.',
            'They eat ice cream.',
            'A big dog jumps on Sami.',
            'Sami is happy because he likes dogs.'
        ],
        questions: [
            {
                id: '1-1',
                question: 'Where are Amir and Sami?',
                options: ['At home', 'At school', 'At the park'],
                correctAnswer: 'At the park'
            },
            {
                id: '1-2',
                question: 'What do they eat?',
                options: ['Pizza', 'Ice cream', 'Apples'],
                correctAnswer: 'Ice cream'
            },
            {
                id: '1-3',
                question: 'Who jumps on Sami?',
                options: ['A cat', 'A bird', 'A dog'],
                correctAnswer: 'A dog'
            }
        ]
    },
    {
        id: '2',
        title: 'Maya\'s Cat',
        emoji: '🐱',
        text: [
            'Maya has a small white cat.',
            'The cat is under the bed.',
            'Maya wants to play with the cat.',
            'She has a yellow ball.'
        ],
        questions: [
            {
                id: '2-1',
                question: 'What color is the cat?',
                options: ['Black', 'White', 'Brown'],
                correctAnswer: 'White'
            },
            {
                id: '2-2',
                question: 'Where is the cat?',
                options: ['On the chair', 'In the kitchen', 'Under the bed'],
                correctAnswer: 'Under the bed'
            },
            {
                id: '2-3',
                question: 'What does Maya have?',
                options: ['A yellow ball', 'A red book', 'A green bag'],
                correctAnswer: 'A yellow ball'
            }
        ]
    },
    {
        id: '3',
        title: 'Rainy Day',
        emoji: '🌧️',
        text: [
            'Today it is rainy and cold.',
            'Lee has a big blue umbrella.',
            'He goes to school with his brother.',
            'They see a red car in the street.'
        ],
        questions: [
            {
                id: '3-1',
                question: 'How is the weather?',
                options: ['Sunny', 'Hot', 'Rainy and cold'],
                correctAnswer: 'Rainy and cold'
            },
            {
                id: '3-2',
                question: 'What color is the umbrella?',
                options: ['Blue', 'Red', 'Yellow'],
                correctAnswer: 'Blue'
            },
            {
                id: '3-3',
                question: 'Who does Lee go with?',
                options: ['His mom', 'His brother', 'His friend'],
                correctAnswer: 'His brother'
            }
        ]
    },
    {
        id: '4',
        title: 'The Lunch Box',
        emoji: '🍱',
        text: [
            'It is twelve o\'clock.',
            'Dan opens his lunch box.',
            'He has a sandwich and an apple.',
            'The apple is red and sweet.'
        ],
        questions: [
            {
                id: '4-1',
                question: 'What time is it?',
                options: ['Ten o\'clock', 'Twelve o\'clock', 'Two o\'clock'],
                correctAnswer: 'Twelve o\'clock'
            },
            {
                id: '4-2',
                question: 'What is in the lunch box?',
                options: ['Cake', 'A sandwich and an apple', 'Milk'],
                correctAnswer: 'A sandwich and an apple'
            },
            {
                id: '4-3',
                question: 'What color is the apple?',
                options: ['Green', 'Red', 'Yellow'],
                correctAnswer: 'Red'
            }
        ]
    },
    {
        id: '5',
        title: 'The Happy Farm',
        emoji: '🚜',
        text: [
            'Gadi goes to the farm.',
            'He sees five cows and one horse.',
            'The cows are brown.',
            'He likes to help his grandpa.'
        ],
        questions: [
            {
                id: '5-1',
                question: 'Where does Gadi go?',
                options: ['To the city', 'To the farm', 'To the beach'],
                correctAnswer: 'To the farm'
            },
            {
                id: '5-2',
                question: 'How many cows does he see?',
                options: ['Five', 'Three', 'Ten'],
                correctAnswer: 'Five'
            },
            {
                id: '5-3',
                question: 'What color are the cows?',
                options: ['White', 'Black', 'Brown'],
                correctAnswer: 'Brown'
            }
        ]
    }
];
