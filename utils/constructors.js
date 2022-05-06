export class CRUDArray extends Array {
  get(itemId, key = '_id') {
    return this.find((item) => key.split('.').reduce((a, b) => a[b], item) === itemId);
  }

  add(newItems, last = false) {
    return new CRUDArray(...(last ? [...this, ...newItems] : [...newItems, ...this]));
  }

  update(itemsId, updatedItem, key = '_id') {
    return new CRUDArray(
      ...this.map((item) =>
        itemsId.includes(key.split('.').reduce((a, b) => a[b], item))
          ? { ...item, ...(typeof updatedItem === 'function' ? updatedItem(item) : updatedItem) }
          : item
      )
    );
  }

  remove(itemsId, keys = ['_id']) {
    return new CRUDArray(
      ...this.filter(
        (item) =>
          !itemsId.some((itemId) =>
            [...keys.map((key) => key.split('.').reduce((a, b) => a[b], item))].includes(itemId)
          )
      )
    );
  }

  addToSet(items, last = false) {
    return last
      ? new CRUDArray(
          ...this.map((item) => items.find((x) => x._id === item._id) || item),
          ...items.filter((item) => !this.map((item) => item._id).includes(item._id))
        )
      : new CRUDArray(
          ...items.filter((item) => !this.map((item) => item._id).includes(item._id)),
          ...this.map((item) => items.find((x) => x._id === item._id) || item)
        );
  }
}
