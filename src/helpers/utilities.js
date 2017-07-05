const checkObject = (obj) =>
  typeof obj === 'object';

const flatten = (arr) => {
  let holder = [];
  for(var i = 0; i < arr.length; i++) {
      if(Array.isArray(arr[i])) {
          holder = holder.concat(flatten(arr[i]));
      } else {
          holder.push(arr[i]);
      }
  }
  return holder;
}

export const parseData = (data) => {
	let arr = data;
	if(checkObject(data)) {
		arr = Object.keys(data).map(x => data[x])
    }
return flatten(arr)
}
