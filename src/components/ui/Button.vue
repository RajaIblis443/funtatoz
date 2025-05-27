<template>
  <button
    :type="type"
    :class=" [
      'relative overflow-hidden inline-flex items-center justify-center rounded-md font-medium focus:outline-none transition-all duration-200',
      sizeClasses,
      variantClasses,
      { 'opacity-60 cursor-not-allowed': disabled || loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <div 
      v-if="loading" 
      class="absolute inset-0 bg-current opacity-10 flex items-center justify-center"
    >
      <div class="animate-spin rounded-full h-5 w-5 border-2" :class="loadingColor"></div>
    </div>

    <span :class="{ 'invisible': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';

const props = defineProps({
  type: {
    type: String as () => ButtonType,
    default: 'button' as ButtonType,
    validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
  },
  variant: {
    type: String as () => ButtonVariant,
    default: 'primary' as ButtonVariant,
    validator: (value: string) => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'link'].includes(value)
  },
  size: {
    type: String as () => ButtonSize,
    default: 'md' as ButtonSize,
    validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

defineEmits(['click']);

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-2.5 py-1.5 text-xs';
    case 'lg': return 'px-6 py-3 text-base';
    default: return 'px-4 py-2 text-sm';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-primary text-white hover:bg-primary-hover focus:ring-2 focus:ring-offset-2 focus:ring-primary';
    case 'secondary': return 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
    case 'success': return 'bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500';
    case 'danger': return 'bg-danger text-white hover:bg-danger-hover focus:ring-2 focus:ring-offset-2 focus:ring-danger';
    case 'warning': return 'bg-warning text-white hover:bg-warning-hover focus:ring-2 focus:ring-offset-2 focus:ring-warning';
    case 'info': return 'bg-info text-white hover:bg-info-hover focus:ring-2 focus:ring-offset-2 focus:ring-info';
    case 'light': return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
    case 'dark': return 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';
    case 'link': return 'bg-transparent text-primary hover:text-primary-hover hover:underline';
    default: return 'bg-primary text-white hover:bg-primary-hover focus:ring-2 focus:ring-offset-2 focus:ring-primary';
  }
});

const loadingColor = computed(() => {
  if (['light', 'link'].includes(props.variant)) {
    return 'border-gray-700 border-t-transparent';
  }
  return 'border-white border-t-transparent';
});
</script>