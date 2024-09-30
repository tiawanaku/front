function createComputed (readVariable) {
  return {
    get () {
      return this[readVariable]
    },
    set (newValue) {
      console.log({ newValue }, `update:${readVariable}`)
      this.$emit(`update:${readVariable}`, newValue)
    }
  }
}

function createComputedState (variable, mutation) {
  return {
    get () { return this.$store.state.global[variable] },
    set (newValue) {
      return this.$store.commit(`global/${mutation}`, newValue)
    }
  }
}

export {
  createComputed,
  createComputedState
}
