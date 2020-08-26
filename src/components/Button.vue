<template>
  <button><slot></slot></button>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
button {
  cursor: pointer;
  outline: none;
  padding: 10px;
  position: relative;
  overflow: auto;
  color: white;
  background-color: transparent;
  border: none;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    &::after {
      width: 30px;
      height: 30px;
      opacity: 1;
    }
    &::before {
      width: 35px;
      height: 35px;
      opacity: 1;
    }
  }
  &::after,&::before {
    border: 1px solid white;
    content: "";
    position: absolute;
    border-radius: 50%;
    opacity: 0;
    transition: 300ms;
    width: 0;
    height: 0;
  }

  margin-left: 10px;
  margin-right: 10px;
  transition: 500ms;
  &:hover {
    transform: scale(1.4);
  }
}
</style>