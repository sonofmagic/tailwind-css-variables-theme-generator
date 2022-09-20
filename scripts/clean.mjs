import { deleteAsync } from 'del'

;(async () => {
  const deletedDirectoryPaths = await deleteAsync(['dist'])
  console.log('Deleted directories:\n', deletedDirectoryPaths.join('\n'))
})()
