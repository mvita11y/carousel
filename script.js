// helper function for turning authors array into a serialized string
const serialComma = (arr, oxford = true) => {
  let str = arr[0];
  if (arr.length === 2) {
    str = arr.join(' and ');
  }
  if (arr.length > 2) {
    const last = arr.pop();
    str = arr.join(', ');
    str += `${oxford ? ',' : ''} and ${last}`;
  }
  return str;
};

Vue.component('book-cover', {
  template: '#book-cover',
  props: {
    title: {
      type: String,
      required: true },

    authors: {
      type: Array },

    thumbnail: {
      type: String,
      required: true },

    infoLink: {
      type: String,
      required: true },

    alt: {
      type: String },

    description: {
      type: String } },


  computed: {
    id() {
      return `cover-${this._uid}`;
    },
    titleText() {
      return `${this.title}, by ${serialComma(this.authors)}`;
    } } });



new Vue({
  el: '#app',
  data() {
    return {
      books: [],
      activeIndex: 0,
      focused: false,
      width: null,
      translate: 0,
      dragging: false };

  },
  computed: {
    activeId() {
      return this.getId(this.activeIndex);
    },
    transform() {
      return `translateX(-${this.translate}px)`;
    },
    carouselRect() {
      return this.$refs.carousel.getBoundingClientRect();
    },
    items() {
      return this.$refs.menu.querySelectorAll('.book-item');
    } },

  watch: {
    activeIndex(newIndex) {
      const carouselWidth = this.$refs.carousel.clientWidth;
      const midpoint = carouselWidth / 2;
      const item = this.items[newIndex];
      const style = window.getComputedStyle(item);
      const diff = item.offsetLeft - midpoint + item.offsetWidth / 2 + parseFloat(style.marginLeft) / 2;
      const max = this.width - carouselWidth;
      if (diff <= 0) {
        this.translate = 0;
      } else if (diff > 0 && diff <= max) {
        this.translate = diff;
      } else {
        this.translate = max;
      }
    } },

  methods: {
    addBook({ title, authors, imageLinks, infoLink, description }) {
      const book = {
        title,
        authors,
        description,
        infoLink,
        thumbnail: imageLinks.thumbnail };

      this.books.push(book);
      return book;
    },
    fetchBooks(fetchPath) {
      return fetch(fetchPath).
      then(res => res.json()).
      then(books => Promise.all(books.items.map(book => Promise.resolve(this.addBook(book.volumeInfo)))));
    },
    getId(i) {
      return `book-${i}`;
    },
    isSelected(i) {
      return this.activeIndex === i;
    },
    decrement(e, n = 1) {
      /* never decrease below 0 (beginning of the array) */
      this.activeIndex = Math.max(this.activeIndex - n, 0);
    },
    increment(e, n = 1) {
      /* never increase beyond the size of the array */
      this.activeIndex = Math.min(this.activeIndex + n, this.books.length - 1);
    },
    open() {
      window.open(this.books[this.activeIndex].infoLink);
    },
    getWidth(el) {
      const style = window.getComputedStyle(el);
      return el.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    },
    updateWidth() {
      this.$nextTick().then(() => {
        this.width = Array.from(this.items).reduce((a, el) => a + this.getWidth(el), 0);
      });
    },
    startDrag() {
      this.dragging = true;
    },
    endDrag() {
      this.dragging = false;
    },
    drag(e) {
      if (this.dragging) {
        e.preventDefault();
        const event = 'touches' in e ? e.touches[0] : e;
        // TODO: implement dragging to scroll list
      }
    } },

  created() {
    const NortonCurrent = `https://www.googleapis.com/books/v1/volumes?q=inpublisher:Norton+inpublisher:Company+${new Date().getFullYear()}&maxResults=40`;
    this.fetchBooks(NortonCurrent).
    then(this.updateWidth.bind(this));
  } });