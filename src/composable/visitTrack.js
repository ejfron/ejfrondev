// useVisitor.js
import { ref, onMounted } from 'vue'

export function useVisitor() {
  const visits = ref(0)

  onMounted(() => {
    let storedVisits = localStorage.getItem('visits')

    if (!storedVisits) {
      storedVisits = 137 // 👈 default starting value
    } else {
      storedVisits = parseInt(storedVisits) + 1
    }

    localStorage.setItem('visits', storedVisits)

    visits.value = storedVisits
  })

  return {
    visits
  }
}