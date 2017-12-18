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
                :href="'#page=' + page" 
                v-for="page in pagination.pages" 
                @click="flip(page)"
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
            this.pagination.current = page - 1;
        }
    },
    created () {
        const page = +hashObj()['page'] || 0;
        const emojiUrl = 'https://api.github.com/gists/0bf11a9aff0d6da7b46f1490f86a71eb';
        new Promise((r, j) => {
            fetch(emojiUrl)
                .then(res => res.json())
                .then(data => {
                    this.emojis = JSON.parse(data.files['emojis.json'].content).emojis;
                    this.pagination.pages = Math.floor(this.emojis.length / this.pagination.emojiPerPage);
                    this.pagination.current = page - 1;
                });
        });
    }
} 
</script>