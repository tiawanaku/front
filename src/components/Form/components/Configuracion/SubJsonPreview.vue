<template>
  <section>
    <div
      v-for="item in json"
      :key="item.key"
    >
      <div v-if="item.children">
        <label
          class="json__item json__item--collapsible"
          :class="{ 'collapse': item.collapse }"
        >
          <input
            type="checkbox"
            class="json__toggle"
            v-model="item.collapse"
          />
          <div class="json__key">
            <q-checkbox
              v-if="item.show"
              :label="item.key"
              dense
              size="sm"
              v-model="item.checked"
            />
            <span v-else>{{ item.key }}</span>
          </div>
          <div :class="`json__value json__value--type-${item.type}`">{{ item.type }}</div>
          <JsonPreview :json="item.children" />
        </label>
      </div>
      <template v-else>
        <div class="json__item">
          <label>
            <div class="json__key json__key-item">
              <q-checkbox
                v-if="item.show"
                :label="item.key"
                dense
                size="sm"
                v-model="item.checked"
              />
              <span v-else>{{ item.key }}</span>
            </div>
            <div :class="`json__value json__value--${item.type}`">
              {{ item.type === 'string' ? `"${item.value.length > 12 ? `${item.value.substring(0, 12)}...` : item.value}"` : item.value === null ? 'null' : item.value }}
            </div>
          </label>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
import JsonPreview from './JsonPreview'

export default {
  components: { JsonPreview },
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    json: {
      default: null,
      required: true
    }
  },
  setup () { }
}
</script>

<style lang="scss">
.json {
  padding: 0px 0 10px 15px;
  font-size: 14px;

  & > {
    .json__item {
      display: block;
    }
  }
}

.json__item {
  display: none;
  margin-top: 4px;
  padding-left: 20px;
  user-select: none;
}

.json__item--collapsible {
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &::before {
    content: "+";
    position: absolute;
    left: 5px;
  }

  &.collapse {
    &::before {
      content: "-";
    }
  }

  &::after {
    background-color: lightgrey;
    content: "";
    height: 100%;
    left: 9px;
    position: absolute;
    top: 26px;
    width: 1px;
  }

  &:hover {
    & > .json__key,
    & > .json__value {
      text-decoration: underline;
    }
  }
}

.json__toggle {
  display: none;

  &:checked ~ .json__item {
    display: block;
  }
}

.json__key {
  color: $primary;
  display: inline;

  &.json__key-item {
    margin-left: -20px;
  }

  &::after {
    content: ": ";
  }
}

.json__value {
  display: inline-block;
  vertical-align: bottom;
}

.json__value--string {
  color: $positive;
}

.json__value--number {
  color: $info;
}

.json__value--boolean {
  color: $negative;
}
</style>
