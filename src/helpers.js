import axios from 'axios'

export const loremApi = (num, size, uid) =>
  axios.get('https://wt-863e332a77d038d29fa50d15961b5367-0.run.webtask.io/lorem-json/lorem', {
    params: { num, size, uid }
  });

export const flattenArray = (arr) => {
  let holder = [];
  for(var i = 0; i < arr.length; i++) {
      if(Array.isArray(arr[i])) {
          holder = holder.concat(flattenArray(arr[i]));
      } else {
          holder.push(arr[i]);
      }
  }
  return holder;
}

export const parseData = (data) => {
	let arr = data;
	if(typeof data === 'object') {
		arr = Object.keys(data).map(x => data[x])
    }
return flattenArray(arr)
}
