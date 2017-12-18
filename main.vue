<template>
    <main>
        <header>
            <h1>Emoji Table</h1>
            <section class="search">
                <input type="text" id="s" placeholder="Search Emoji..." v-model="search">
            </section>
        </header>
        
        <ul class="emoji" v-if="emojis.length">
            <li v-for="emoji in emojiList" @click="showEmoji(emoji, $event)">
                <div class="cover">
                    <h3>{{ emoji.emoji }}</h3>
                    <section class="meta">
                        <p>
                            <span>Name</span><span>{{ emoji.name }}</span>
                        </p>
                        <p>
                            <span>Shortname</span><span>{{ emoji.shortname }}</span>
                        </p>
                        <p>
                            <span>Unicode</span><span>{{ emoji.unicode }}</span>
                        </p>
                        <p>
                            <span>HTML</span><span>{{ emoji.html }}</span>
                        </p>
                    </section>
                </div>
            </li>
        </ul>
        <section class="loading" v-else>
            Loading……
        </section>
        <nav class="pagination" v-if="emojis">
            <a 
                href="#" 
                v-for="page in pagination.pages" 
                @click.prevent="flip(page)"
                :class="{'active': (page - 1) === pagination.current}"
            >
                {{ page }}
            </a>
        </nav>
        <footer>
            Emoji data from <a href="https://gist.githubusercontent.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb/">Emojis.json</a> - 
            Made with ❤ By <a href="https://geeku.net/">Geeku</a>
        </footer>
    </main>
</template>

<script>
function hashObj () {
    const retObj = {};
    const hashArr = location.hash.slice(1).split('&').forEach(item => {
        const split = item.split('=');
        retObj[split[0]] = split[1];
    });
    return retObj;
}
function setHash (name, val, clean = false) {
    const hash = hashObj();
    hash[name] = val;
    if (clean) {
        location.hash = `${name}=${val}`
    } else {
        location.hash = Object.keys(hash).map(name => `${name}=${hash[name]}`).join('&');
    }
    return location.hash;
}
let searchCache = '';
export default {
    name: 'Main',
    data () {
        return {
            emojis: [],
            search: '',
            pagination: {
                pages: 0,
                current: 0,
                emojiPerPage: 100
            }
        }
    },
    computed: {
        emojiList () {

            if (this.search !== searchCache) {
                this.pagination.current = 0;
                searchCache = this.search;
                setHash('search', this.search, true);
            }

            const start = this.pagination.current * this.pagination.emojiPerPage;
            const end = start + this.pagination.emojiPerPage;
            const search = this.search ? this.search : '[\s\S]*';
            const filtered = this.emojis.filter(emoji => {
                return (new RegExp(this.search, 'i')).test(emoji.name);
            });
            
            this.pagination.pages = Math.floor(filtered.length / this.pagination.emojiPerPage);
            return filtered.slice(start, end);
        }
    },
    methods: {
        flip (page) {
            setHash('page', page);
        }
    },
    created () {
        const page = +hashObj()['page'] || 1;
        const emojiUrl = 'https://api.github.com/gists/0bf11a9aff0d6da7b46f1490f86a71eb';
        new Promise((r, j) => {
            fetch(emojiUrl)
                .then(res => res.json())
                .then(data => {
                    this.emojis = JSON.parse(data.files['emojis.json'].content).emojis;
                    this.pagination.pages = Math.floor(this.emojis.length / this.pagination.emojiPerPage);
                    this.pagination.current = page - 1;
                    this.search = hashObj()['search'] || '';
                });
        });

        window.onhashchange = () => {
            const hash = hashObj();
            if (hash['page']) {
                this.pagination.current = hash['page'] - 1;
            }
            if (hash['search']) {
                this.search = hash['search'];
            }
        }
    }
} 
</script>