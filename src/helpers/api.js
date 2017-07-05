import axios from 'axios'

export const loremApi = (num, size, uid) =>
  axios.get('https://wt-863e332a77d038d29fa50d15961b5367-0.run.webtask.io/lorem-json/lorem', {
    params: { num, size, uid }
  });
