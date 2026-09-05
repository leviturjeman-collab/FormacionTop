import {test,expect} from '@playwright/test';
test('crear tarea y verla después de recargar',async({page})=>{
 await page.goto('/');await page.getByLabel('Título').fill('Entregar pedido');await page.getByRole('button',{name:'Guardar'}).click();
 await expect(page.getByRole('listitem')).toHaveText('Entregar pedido');await page.reload();await expect(page.getByRole('listitem')).toHaveText('Entregar pedido');
});
test('rechazar formulario inválido',async({request})=>{const r=await request.post('/tasks',{form:{title:' '}});expect(r.status()).toBe(400);});
