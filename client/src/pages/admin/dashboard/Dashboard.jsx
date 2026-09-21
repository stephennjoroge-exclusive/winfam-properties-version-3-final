import React from 'react'

const Dashboard = () => {
    return (
        <div>
           <div className='space-y-4'>
  <div>
    <p className='font-bold'>Occupancy & vacancy</p>
    <ol className='list-decimal list-inside space-y-1'>
      <li>Vacant units per property (and portfolio-wide vacancy rate)</li>
      <li>Occupied units per property</li>
      <li>Occupancy rate % per property (occupied ÷ total units)</li>
      <li>Units vacant for longer than X days — flag problem properties</li>
      <li>Average vacancy duration per property</li>
    </ol>
  </div>

  <div>
    <p className='font-bold'>Financial</p>
    <ol className='list-decimal list-inside space-y-1'>
      <li>Total expected rent per property (sum of unit rent amounts)</li>
      <li>Total actual rent collected per property (sum of payments this month)</li>
      <li>Outstanding/overdue rent per property (expected minus collected)</li>
      <li>Water bill total per property (units × water_rate, or metered usage)</li>
      <li>Total revenue per landlord (across all their properties)</li>
      <li>Collection rate % (collected ÷ expected) per property</li>
    </ol>
  </div>

  <div>
    <p className='font-bold'>Tenants</p>
    <ol className='list-decimal list-inside space-y-1'>
      <li>Total tenants per property</li>
      <li>Tenants with overdue payments per property</li>
      <li>New tenants this month per property (move-ins)</li>
      <li>Tenants who've given notice / are leaving soon per property</li>
    </ol>
  </div>

  <div>
    <p className='font-bold'>Maintenance</p>
    <ol className='list-decimal list-inside space-y-1'>
      <li>Open maintenance requests per property</li>
      <li>Average time-to-resolve per property</li>
      <li>Most frequently reported issue type per property</li>
    </ol>
  </div>

  <div>
    <p className='font-bold'>Portfolio-level (per landlord)</p>
    <ol className='list-decimal list-inside space-y-1'>
      <li>Total properties per landlord</li>
      <li>Total units across all their properties</li>
      <li>Total tenants across all their properties</li>
      <li>Combined occupancy rate across their portfolio</li>
      <li>Total revenue across their portfolio</li>
    </ol>
  </div>
</div>
        </div>
    )
}

export default Dashboard
