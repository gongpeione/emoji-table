<template>
    <main>
        <header><h1>Emoji Table</h1></header>
        <section class="search">
            <input type="text" id="s">
        </section>
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
                :class="{'active': page === pagination.current}"
            >
                {{ page }}
            </a>
        </nav>
    </main>
</template>

<script>
export default {
    name: 'Main',
    data () {
        return {
            emojis: [],
            pagination: {
                pages: 0,
                current: 0,
                emojiPerPage: 100
            }
        }
    },
    computed: {
        emojiList () {
            const prev = this.pagination.current * this.pagination.emojiPerPage;
            return this.emojis.slice(prev, prev + this.pagination.emojiPerPage);
        }
    },
    methods: {
        flip (page) {
            this.pagination.current = page - 1;
        }
    },
    created () {
        const emojiUrl = 'https://api.github.com/gists/0bf11a9aff0d6da7b46f1490f86a71eb';
        new Promise((r, j) => {
            fetch(emojiUrl)
                .then(res => res.json())
                .then(data => {
                    this.emojis = JSON.parse(data.files['emojis.json'].content).emojis;
                    this.pagination.pages = Math.floor(this.emojis.length / this.pagination.emojiPerPage);
                });
        });
    }
} 
</script>