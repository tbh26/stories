const hnBaseApi = 'https://hn.algolia.com/api/v1';

const noItem = '';

type Story = {
    objectID: number;
    url: string;
    title: string;
    author: string;
    num_comments: number;
    points: number;
};

export { hnBaseApi, noItem, Story };
