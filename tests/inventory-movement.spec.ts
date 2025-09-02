import { test, expect, APIRequestContext } from '@playwright/test';

// --- Helper Functions / Constants ---
// Bạn cần thay thế các giá trị này bằng thông tin thực tế
const BASE_API_URL = 'https://oms-staging.vigoretail.com/api/v1'; // Giả định
const AUTH_TOKEN = 'your-auth-token'; // Cần có token để gọi API

// ID của các đối tượng cần thiết cho việc test
const WAREHOUSE_GT_ID = 'warehouse-gt-id';
const WAREHOUSE_MT_ID = 'warehouse-mt-id';
const SKU_GT_NO_STOCK = 'SKU-GT-01';
const SKU_GT_HAS_STOCK = 'SKU-GT-02';
const SKU_MT_HAS_STOCK = 'SKU-MT-01';


/**
 * Hàm giả định để thiết lập trạng thái tồn kho ban đầu cho sản phẩm.
 * Bạn cần thay thế bằng API call thực tế.
 */
async function setInitialStock(request: APIRequestContext, sku: string, warehouseId: string, salableQty: number, awaitingQty: number) {
    const response = await request.post(`${BASE_API_URL}/inventory/set-stock`, {
        headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
        data: {
            sku: sku,
            warehouseId: warehouseId,
            salableQuantity: salableQty,
            awaitingForSaleQuantity: awaitingQty,
        }
    });
    expect(response.ok(), `Failed to set initial stock for ${sku}`).toBeTruthy();
}

/**
 * Hàm giả định để tạo và duyệt một Inbound.
 * Trả về ID của Inbound và Inventory Movement được tạo ra.
 */
async function createAndApproveInbound(request: APIRequestContext, sku: string, warehouseId: string, qty: number, entityType: string): Promise<{inboundId: string, movementId: string}> {
    // Đây là một quy trình phức tạp, có thể cần nhiều API calls
    // Ví dụ: tạo purchase order, tạo inbound, sau đó approve
    const response = await request.post(`${BASE_API_URL}/inbound/finance-approve`, {
        headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
        data: {
            items: [{ sku: sku, quantity: qty }],
            warehouseId: warehouseId,
            entityType: entityType, // 'purchase_order' hoặc 'mt_purchase_order'
        }
    });
    expect(response.ok(), `Failed to approve inbound for ${sku}`).toBeTruthy();
    const body = await response.json();
    return { inboundId: body.inboundId, movementId: body.inventoryMovementId };
}


test.describe('Inventory Movement Scenarios', () => {

    test('[GT] Stock moves to SALABLE when no existing salable stock', async ({ request }) => {
        // --- ARRANGE ---
        await setInitialStock(request, SKU_GT_NO_STOCK, WAREHOUSE_GT_ID, 0, 5); // Bắt đầu với 0 salable

        // --- ACT ---
        await createAndApproveInbound(request, SKU_GT_NO_STOCK, WAREHOUSE_GT_ID, 10, 'purchase_order');

        // --- ASSERT ---
        const stockRes = await request.get(`${BASE_API_URL}/inventory/stock/${SKU_GT_NO_STOCK}?warehouseId=${WAREHOUSE_GT_ID}`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
        });
        const stockData = await stockRes.json();
        expect(stockData.salableQuantity).toBe(10); // 0 + 10 = 10
        expect(stockData.awaitingForSaleQuantity).toBe(5); // Không thay đổi
    });

    test('[GT] Stock moves to AWAITING FOR SALE when salable stock exists', async ({ request }) => {
        // --- ARRANGE ---
        await setInitialStock(request, SKU_GT_HAS_STOCK, WAREHOUSE_GT_ID, 20, 5); // Bắt đầu với 20 salable

        // --- ACT ---
        await createAndApproveInbound(request, SKU_GT_HAS_STOCK, WAREHOUSE_GT_ID, 10, 'purchase_order');

        // --- ASSERT ---
        const stockRes = await request.get(`${BASE_API_URL}/inventory/stock/${SKU_GT_HAS_STOCK}?warehouseId=${WAREHOUSE_GT_ID}`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
        });
        const stockData = await stockRes.json();
        expect(stockData.salableQuantity).toBe(20); // Không thay đổi
        expect(stockData.awaitingForSaleQuantity).toBe(15); // 5 + 10 = 15
    });

    test('[MT] Stock ALWAYS moves to SALABLE regardless of existing stock', async ({ request }) => {
        // --- ARRANGE ---
        await setInitialStock(request, SKU_MT_HAS_STOCK, WAREHOUSE_MT_ID, 20, 5); // Bắt đầu với 20 salable

        // --- ACT ---
        await createAndApproveInbound(request, SKU_MT_HAS_STOCK, WAREHOUSE_MT_ID, 10, 'mt_purchase_order');

        // --- ASSERT ---
        const stockRes = await request.get(`${BASE_API_URL}/inventory/stock/${SKU_MT_HAS_STOCK}?warehouseId=${WAREHOUSE_MT_ID}`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
        });
        const stockData = await stockRes.json();
        expect(stockData.salableQuantity).toBe(30); // 20 + 10 = 30
        expect(stockData.awaitingForSaleQuantity).toBe(5); // Không thay đổi
    });
    
    test('[MT] Verify Inventory Movement financial details', async ({ request }) => {
        // --- ARRANGE ---
        await setInitialStock(request, SKU_MT_HAS_STOCK, WAREHOUSE_MT_ID, 20, 5);
        
        // --- ACT ---
        const { movementId } = await createAndApproveInbound(request, SKU_MT_HAS_STOCK, WAREHOUSE_MT_ID, 10, 'mt_purchase_order');

        // --- ASSERT ---
        const movementRes = await request.get(`${BASE_API_URL}/inventory/movement/${movementId}`, {
            headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
        });
        const movementData = await movementRes.json();

        expect(movementData.processType).toBe('Retail');
        expect(movementData.productSegment).toBe('Principle');
        expect(movementData.distributorCogs).toBeGreaterThan(0); // Giả định giá trị này phải có
        expect(movementData.marketSurveyPurchasePriceDistributor).toBeGreaterThan(0); // Giả định giá trị này phải có
        expect(movementData.vatCogsVigo).toBe(0);
        expect(movementData.marketSurveyPurchasePriceVigo).toBe(0);
        expect(movementData.surveySellingPrice).toBe(0);
        expect(movementData.listedSellingPrice).toBe(0);
    });

});
